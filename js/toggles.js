import { getRows } from "./table/table-functions.js";
import { perimeterId, cfgSportA } from "../setup.js";
import { existsDetail } from "./details/details-functions.js";

export function setUpToggles() {
    const toggles = d3.select("#toggles");
    toggles
        .append("div")
        .attr("class", "toggle-area center")
        .attr("id", "two-point-toggle-area");
    toggles
        .append("div")
        .attr("class", "toggle-area center")
        .attr("id", "heat-map-toggle-area");
    toggles
        .append("div")
        .attr("class", "toggle-area center")
        .attr("id", "heat-map-team-select")
        .style("display", "none");

    setupHeatMapTeamSelect();
    twoPointFunctionality();
    heatMapFunctionality();
}

function setupHeatMapTeamSelect() {
    const checks = d3.select("#heat-map-team-select");

    const div1 = checks
        .append("div")
        .attr("class", "form-check form-check-inline");
    div1.append("input")
        .attr("class", "form-check-input")
        .attr("type", "checkbox")
        .property("checked", true)
        .attr("id", "blueTeam-heat-map")
        .attr("value", "blueTeam-heat-map")
        .on("change", function () {
            if (d3.select(this).property("checked")) {
                d3.select("#blueTeam-heat-map-svg").attr("display", "auto");
            } else {
                d3.select("#blueTeam-heat-map-svg").attr("display", "none");
            }
        });
    div1.append("label")
        .attr("class", "form-check-label")
        .attr("for", "blueTeam-heat-map")
        .attr("id", "blueTeam-heat-map-label")
        .text("Home");
    const div2 = checks
        .append("div")
        .attr("class", "form-check form-check-inline");
    div2.append("input")
        .attr("class", "form-check-input")
        .attr("type", "checkbox")
        .property("checked", true)
        .attr("id", "orangeTeam-heat-map")
        .attr("value", "orangeTeam-heat-map")
        .on("change", function () {
            if (d3.select(this).property("checked")) {
                d3.select("#orangeTeam-heat-map-svg").attr("display", "auto");
            } else {
                d3.select("#orangeTeam-heat-map-svg").attr("display", "none");
            }
        });
    div2.append("label")
        .attr("class", "form-check-label")
        .attr("for", "orangeTeam-heat-map")
        .attr("id", "orangeTeam-heat-map-label")
        .text("Away");
}

export function regenHeatMapTeamNames() {
    d3.select("#blueTeam-heat-map-label").text(
        d3.select("#blue-team-name").property("value")
    );
    d3.select("#orangeTeam-heat-map-label").text(
        d3.select("#orange-team-name").property("value")
    );
}

export function twoPointFunctionality() {
    function setOn() {
        sessionStorage.setItem("shiftHeld", true);
        d3.select("#two-point-toggle").property("checked", true);
    }
    function setOff() {
        d3.select("#two-point-toggle").property("checked", false);
        sessionStorage.setItem("shiftHeld", false);
        sessionStorage.setItem("firstPoint", null);
        d3.select("#ghost").selectAll("*").remove();
    }
    if (d3.select("#two-point-enable").property("checked")) {
        d3.select("body")
            .on("keydown", function (e) {
                if (e.key === "Shift") {
                    setOn();
                }
            })
            .on("keyup", function (e) {
                if (e.key === "Shift") {
                    setOff();
                }
            });
        d3.select("#two-point-toggle-area").selectAll("*").remove();
        const toggleArea = d3.select("#two-point-toggle-area");
        toggleArea
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", "two-point-toggle")
            .text("1-Location");
        let toggle = toggleArea
            .append("div")
            .attr("class", "form-check form-switch");
        toggle
            .append("input")
            .attr("class", "form-check-input")
            .attr("type", "checkbox")
            .attr("id", "two-point-toggle")
            .on("change", () =>
                d3.select("#two-point-toggle").property("checked")
                    ? setOn()
                    : setOff()
            );
        toggleArea
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", "two-point-toggle")
            .text("2-Location");
    } else {
        setOff();
        d3.select("body").on("keydown", null).on("keyup", null);
        d3.select("#two-point-toggle-area").selectAll("*").remove();
    }
}

export function heatMapFunctionality() {
    function setOn() {
        d3.select("#dots").attr("display", "none");
        heatMap();
        if (existsDetail("#team")) {
            regenHeatMapTeamNames();
            d3.select("#heat-map-team-select").style("display", "flex");
        }
    }
    function setOff() {
        d3.select("#dots").attr("display", "contents");
        d3.select("#heat-map").selectAll("*").remove();
        d3.select("#heat-map-team-select").style("display", "none");
    }
    if (d3.select("#heat-map-enable").property("checked")) {
        d3.select("#heat-map-toggle-area").selectAll("*").remove();

        const toggleArea = d3.select("#heat-map-toggle-area");

        toggleArea
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", "heat-map-toggle")
            .text("Event Dot View");
        let toggle = toggleArea
            .append("div")
            .attr("class", "form-check form-switch");
        toggle
            .append("input")
            .attr("class", "form-check-input")
            .attr("type", "checkbox")
            .attr("id", "heat-map-toggle")
            .on("change", () =>
                d3.select("#heat-map-toggle").property("checked")
                    ? setOn()
                    : setOff()
            );
        toggleArea
            .append("label")
            .attr("class", "form-check-label")
            .attr("for", "heat-map-toggle")
            .text("Heat Map View");
    } else {
        setOff();
        d3.select("#heat-map-toggle-area").selectAll("*").remove();
        d3.select("#heat-map-team-select").selectAll("*").remove();
    }
}

export function heatMap() {
    d3.select("#heat-map").selectAll("*").remove();

    // compute the density data
    const data = _.map(getRows(), (r) => ({
        team: r.specialData.teamColor,
        x: r.specialData.coords[0],
        y: r.specialData.coords[1],
    }));

    function colorFunc(colorName) {
        let color;
        let bgColor;
        switch (colorName) {
            case "blueTeam":
                bgColor = "rgba(53, 171, 169, 0.01)";
                color = "rgba(53, 171, 169, 0.2)";
                break;
            case "orangeTeam":
                bgColor = "rgba(234, 142, 72, 0.01)";
                color = "rgba(234, 142, 72, 0.2)";
                break;
            default:
                bgColor = "rgba(170, 170, 170, 0.01)";
                color = "rgba(170, 170, 170, 0.2)";
                break;
        }
        return d3
            .scaleLinear()
            .domain([0, 0.01]) // Points per square pixel.
            .range([bgColor, color]);
    }

    const groupedData = _.groupBy(data, "team");

    const scale = cfgSportA.heatMapScale;
    const unscale = _.round(1 / scale, 2);

    for (const color in groupedData) {
        const colorRange = colorFunc(color);
        const densityData = d3
            .contourDensity()
            .x((d) => {
                return d.x * scale;
            })
            .y((d) => d.y * scale)
            .thresholds(20)
            .cellSize(2)
            .bandwidth(4)(groupedData[color]);
        d3.select("#heat-map")
            .insert("g", "g")
            .attr("id", color + "-heat-map-svg")
            .attr(
                "display",
                (color !== "blueTeam" && color !== "orangeTeam") ||
                    d3.select("#" + color + "-heat-map").property("checked")
                    ? "auto"
                    : "none"
            )
            .attr("transform", `scale(${unscale},${unscale})`)
            .selectAll("path")
            .data(densityData)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("fill", function (d) {
                return colorRange(d.value);
            });
    }
}
