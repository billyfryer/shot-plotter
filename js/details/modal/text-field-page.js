import {
    changePage,
    getDetails,
    setDetails,
    createId,
} from "../details-functions.js";
import { createTextField } from "../widgets/widgets-base.js";
import { createReorderColumns } from "./main-page.js";

function createTextFieldPage(id, data) {
    d3.select(id).selectAll("*").remove();

    let mb = d3
        .select(id)
        .append("div")
        .attr("id", "text-field-page-mb")
        .attr("class", "modal-body");

    // explanation text
    mb.append("h6").text("Create Text Field Widget");

    // example
    mb.append("div")
        .attr("id", "text-field-page-example")
        .attr("class", "center example");
    createTextField(
        "#text-field-page-example",
        data
            ? { ...data, id: "sample-text-field" }
            : {
                  id: "sample-text-field",
                  title: "Detail Name",
                  defaultValue: "Default Text",
              }
    );

    mb.append("div").text(
        "Enter the detail name and any default text for the text field."
    );
    mb.append("hr");
    // text field
    let form = mb
        .append("form")
        .attr("class", "need-validation")
        .attr("novalidate", "true");
    let nameDiv = form
        .append("div")
        .attr("class", "form-group position-relative");
    nameDiv
        .append("label")
        .attr("for", "text-field-title")
        .attr("class", "form-label")
        .text("Detail Name");
    nameDiv
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("id", "text-field-title")
        .property("value", data ? data.title : "");
    nameDiv
        .append("div")
        .attr("class", "invalid-tooltip")
        .text(
            "Detail names must be 1-16 characters long, and can only contain alphanumeric characters, dashes, underscores, and spaces."
        );
    let defaultTextDiv = form
        .append("div")
        .attr("class", "form-group position-relative");
    defaultTextDiv
        .append("label")
        .attr("for", "text-field-default-text")
        .attr("class", "form-label")
        .text("Default Text");
    defaultTextDiv
        .append("input")
        .attr("type", "text")
        .attr("class", "form-control")
        .attr("id", "text-field-default-text")
        .property("value", data ? data.defaultValue : "");
    defaultTextDiv
        .append("div")
        .attr("class", "invalid-tooltip")
        .text("Default text can be at most 32 characters long.");

    let checkbox = form.append("div").attr("class", "form-check");
    checkbox
        .append("input")
        .attr("type", "checkbox")
        .attr("class", "form-check-input")
        .attr("id", "text-field-editable-checkbox");
    checkbox
        .append("label")
        .attr("class", "form-check-label")
        .attr("for", "text-field-editable-checkbox")
        .text("Allow editing in data table.");
    // footer
    let footer = d3.select(id).append("div").attr("class", "footer-row");
    footer
        .append("button")
        .attr("type", "button")
        .attr("class", "grey-btn")
        .text("Back")
        .on(
            "click",
            data
                ? () => changePage(id, "#main-page")
                : () => changePage(id, "#widget-type-page")
        );

    footer
        .append("button")
        .attr("type", "button")
        .attr("class", "grey-btn")
        .text("Create Text Field")
        .on(
            "click",
            data ? () => createNewTextField(data) : () => createNewTextField()
        );
}

function createNewTextField(data) {
    let invalid = false;

    const title = d3.select("#text-field-title").property("value");
    if (
        title.length < 1 ||
        title.length > 16 ||
        !/^[_a-zA-Z0-9- ]*$/.test(title)
    ) {
        d3.select("#text-field-title").classed("is-invalid", true);
        invalid = true;
    } else {
        d3.select("#text-field-title").classed("is-invalid", false);
    }

    const text = d3.select("#text-field-default-text").property("value");
    if (text.length >= 32) {
        d3.select("#text-field-default-text").classed("is-invalid", true);
        invalid = true;
    } else {
        d3.select("#text-field-default-text").classed("is-invalid", false);
    }
    if (invalid) {
        return;
    }

    let details = getDetails();
    const newDetail = {
        type: "text-field",
        title: title,
        id: createId(title),
        defaultValue: text,
        editable: true,
        dataTableEditable: d3
            .select("#text-field-editable-checkbox")
            .property("checked"),
    };
    if (data) {
        let i = _.findIndex(details, data);
        details.splice(i, 1, newDetail);
    } else {
        details.push(newDetail);
    }
    setDetails(details);
    createReorderColumns("#reorder");

    changePage("#text-field-page", "#main-page");
}

export { createTextFieldPage };
