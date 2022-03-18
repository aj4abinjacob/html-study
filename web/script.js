var inputs_container,
  column_inputs_container_var,
  current_selection,
  all_file_names,
  more_than_one_input;

all_file_names = [];
all_column_names = [];
var already_showed_files = [];

// Extract number from string
function getOnlyNumber(text) {
  return Number(text.replace(/\D/g, ""));
}

// Count number of items occurring in an array
function count(arr) {
  return arr.reduce(
    (prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev),
    {}
  );
}

//Disable browse button and submit button during initial window
function showHideWelcomeButton() {
  if (already_showed_files.length === 0) {
    document.getElementById("add-more-button").style.display = "none";
    document.getElementById("welcome-submit-button").style.display = "none";
  } else {
    document.getElementById("add-more-button").style.display = "inline-block";
    document.getElementById("welcome-submit-button").style.display =
      "inline-block";
  }
}

showHideWelcomeButton();

async function getFiles(id) {
  files_and_columns = await eel.selectFiles()(); // Must prefix call with 'await', otherwise it's the same syntax
  //   console.log("Got this from Python: " + n[0]);
  file_names_container = document.getElementById("file-names-container");
  all_file_names = [...new Set(all_file_names)];
  if (id === "browse-button") {
    already_showed_files = [];
    file_names_container.replaceChildren();
    document.getElementById("inputs-container").replaceChildren();
    all_file_names = files_and_columns[0];
    all_column_names = files_and_columns[1];
  } else {
    all_file_names.push(...files_and_columns[0]);
    all_column_names.push(...files_and_columns[1]);
  }

  // console.log(all_file_names)
  // console.log(all_column_names)

  // Show file names received
  for (let i = 0; i < all_file_names.length; i++) {
    file_name = all_file_names[i];
    if (already_showed_files.includes(file_name) == false) {
      file_name_element = document.createElement("p");
      file_name_element.textContent = `${
        already_showed_files.length + 1
      }. ${file_name}`;
      file_names_container.appendChild(file_name_element);
      already_showed_files.push(file_name);
    }
  }
  showHideWelcomeButton();
}

let addColumnsFromPython = function () {
  all_column_container_div = document.getElementById("column-names-container");
  all_column_container_div.replaceChildren();
  // Add column names button received from python
  for (let i = 0; i < all_column_names.length; i++) {
    column_name = all_column_names[i];
    column_button = document.createElement("input");
    column_button.setAttribute("type", "button");
    column_button.setAttribute("value", column_name);
    column_button.setAttribute(
      "class",
      "all-column-names-button btn all-col-btn"
    );
    column_button.setAttribute("id", `button_id_${column_name}`);
    column_button.setAttribute("onclick", "sendColumnToInput(this.value)");
    all_column_container_div.appendChild(column_button);
  }
};

//Check Input

function checkInput() {
  more_than_one_input = 0;
  column_names_to_check = document.getElementsByClassName("column-names-input");
  columns_user_has_added = [];
  for (let i = 0; i < column_names_to_check.length; i++) {
    input_string = column_names_to_check[i].value;
    if (input_string.length > 1) {
      input_string.split(",").forEach((el) => {
        columns_user_has_added.push(el);
      });
    }
  }
  column_names_and_frequencies = count(columns_user_has_added);
  // console.log(column_names_and_frequencies)
  for (let i = 0; i < all_column_names.length; i++) {
    el = all_column_names[i];
    if (
      columns_user_has_added.includes(el) &&
      column_names_and_frequencies[el] === 1
    ) {
      document.getElementById(`button_id_${el}`).style.background = "#FFD700"; //yellow
    } else if (!columns_user_has_added.includes(el)) {
      document.getElementById(`button_id_${el}`).style.background = "#E0E0E0"; //grey
    } else {
      document.getElementById(`button_id_${el}`).style.background = "#FF0000"; //red
      more_than_one_input++;
    }
  }
}

function initiateProcessScreen() {
  document.getElementById("welcome-container").style.display = "none";
  document.getElementById("process-screen").style.display = "block";
  all_column_names = [...new Set(all_column_names)];
  all_column_names.sort();
  addColumnsFromPython();
  checkInput();
  addMore();
}

function goBack() {
  document.getElementById("welcome-container").style.display = "block";
  document.getElementById("process-screen").style.display = "none";
}

// Set current focus

function setCurrentFocus(id) {
  // console.log(id);
  current_selection = id;
  checkInput();
}

// Send column name to input

function sendColumnToInput(column_name) {
  if (current_selection.includes("column_names_input_")) {
    existing_value_in_column_names_input =
      document.getElementById(current_selection).value;
    existing_value_in_column_names_input_array = document
      .getElementById(current_selection)
      .value.split(",");
    existing_value_in_column_names_input_array =
      existing_value_in_column_names_input_array.filter((e) => e.length > 0);
    if (existing_value_in_column_names_input.length > 0) {
      if (existing_value_in_column_names_input_array.includes(column_name)) {
        existing_value_in_column_names_input_array =
          existing_value_in_column_names_input_array.filter(
            (e) => e !== column_name
          );
        // document.getElementById(current_selection).value = existing_value_in_column_names_input.replace(new RegExp("\\b"+column_name+"\\b"), "");
        // existing_value_in_column_names_input = document.getElementById(current_selection).value
        // document.getElementById(current_selection).value = existing_value_in_column_names_input.replace(",,",",").replace(/(^,)|(,$)/g, "")
        document.getElementById(current_selection).value = String(
          existing_value_in_column_names_input_array
        );
      } else {
        existing_value_in_column_names_input_array.push(column_name);
        document.getElementById(current_selection).value = String(
          existing_value_in_column_names_input_array
        );
      }
    } else {
      document.getElementById(current_selection).value = column_name;
    }
  } else {
    document.getElementById(current_selection).value = column_name;
  }
  // Check after sending to input
  checkInput();
}

column_inputs_container_var = 1;
inputs_container = document.getElementById("inputs-container");

function addMore() {
  // adding header input
  header_input = document.createElement("input");
  header_input.setAttribute("type", "input");
  header_input.setAttribute("placeholder", "Header");
  header_input.setAttribute("oninput", "checkInput()");
  // header_input.setAttribute("onkeydown","addAnotherInput()")
  header_input.setAttribute(
    "id",
    `header_input_${column_inputs_container_var}`
  );
  header_input.setAttribute("onclick", "setCurrentFocus(this.id)");
  header_input.setAttribute(
    "class",
    `headers-input rm_${column_inputs_container_var} process-input-field`
  );

  inputs_container.appendChild(header_input);

  // adding column names
  column_names_input = document.createElement("input");
  column_names_input.setAttribute("type", "input");
  column_names_input.setAttribute("placeholder", "Column Names");
  column_names_input.setAttribute(
    "id",
    `column_names_input_${column_inputs_container_var}`
  );
  column_names_input.setAttribute("onclick", "setCurrentFocus(this.id)");
  column_names_input.setAttribute("oninput", "checkInput()");
  column_names_input.setAttribute(
    "class",
    `column-names-input rm_${column_inputs_container_var} process-input-field`
  );
  inputs_container.appendChild(column_names_input);

  // adding remove button
  remove_button = document.createElement("input");
  remove_button.setAttribute("type", "button");
  remove_button.setAttribute("value", "Remove");
  remove_button.setAttribute(
    "id",
    `remove_button_${column_inputs_container_var}`
  );
  remove_button.setAttribute(
    "class",
    `remove-button rm_${column_inputs_container_var} btn`
  );
  remove_button.setAttribute("onclick", "removeInputDiv(this)");
  inputs_container.appendChild(remove_button);

  // Setting focus to current column names input
  current_selection = `header_input_${column_inputs_container_var}`;

  // set focus to current div when user press add
  remove_button.scrollIntoView();
  header_input.focus();

  // Check Input
  checkInput();

  // adding column_inputs_container_var
  column_inputs_container_var++;
}

// Notice enter key
function keydown(evt) {
  if (
    evt.shiftKey &&
    evt.keyCode === 13 &&
    document.getElementById("welcome-container").style.display === "none"
  ) {
    column_names_input_check =
      document.getElementsByClassName("column-names-input");
    inputs_last_element =
      column_names_input_check[column_names_input_check.length - 1];
    current_selection_num = getOnlyNumber(current_selection);
    if (current_selection.includes("header_input")) {
      current_selection = `column_names_input_${current_selection_num}`;
      document.getElementById(current_selection).focus();
    } else if (
      current_selection.includes("column_names_input") &&
      current_selection === inputs_last_element.id
    ) {
      addMore();
    } else {
      next_sibling = document.getElementById(current_selection).nextSibling;
      next_sibling = document.getElementById(next_sibling.id).nextSibling;
      next_sibling.focus();
      current_selection = next_sibling.id;
    }
  }
}
document.onkeydown = keydown;

// Remove button function
function removeInputDiv(button) {
  number_of_inputs = document.getElementsByClassName(`process-input-field`);
  if (number_of_inputs.length > 2) {
    rm_class = `${button.className}`.split(" ");
    rm_class = rm_class[rm_class.length - 2];
    document.querySelectorAll(`.${rm_class}`).forEach((el) => el.remove());
    // Check Input
    checkInput();
  }
}

// Send user inputs to python

async function sendUserInputToPython() {
  column_names_elements = document.getElementsByClassName("column-names-input");
  column_names = [];
  for (let i = 0; i < column_names_elements.length; i++) {
    column_names.push(column_names_elements[i].value);
  }
  headers_input_elements = document.getElementsByClassName("headers-input");
  headers_input = [];
  for (let i = 0; i < headers_input_elements.length; i++) {
    headers_input.push(headers_input_elements[i].value);
  }
  all_file_names = [...new Set(all_file_names)];
  valid_submit = true;
  valid_column_names = true;
  for (let i = 0; i < column_names.length; i++) {
    if (headers_input[i] === "" || column_names[i] === "") {
      valid_submit = false;
    }
    each_column_input_elements = column_names[i].split(",");
    for (let j = 0; j < each_column_input_elements.length; j++) {
      if (all_column_names.includes(each_column_input_elements[j]) === false) {
        valid_column_names = false;
      }
    }
  }

  //check to see if user has entered column input more than once
  checkInput();
  //

  if (valid_submit === false && valid_column_names === true) {
    alert("Please fill all input fields");
  } else if (more_than_one_input > 0) {
    alert("You have entered a column input more than once");
  } else if (valid_column_names === false) {
    alert("Please fill column names input field with valid inputs");
    // If checks have passed data will start from here
  } else {
    for (let i = 0; i < all_file_names.length; i++) {
      file = all_file_names[i];
      file_status = await eel.receiveInputs(
        file,
        headers_input,
        column_names
      )();
      console.log(file_status);
    }

    final_status = await eel.finalCombine()();
    alert(final_status);
  }
  // final_status = await eel.finalCombine()();
}
