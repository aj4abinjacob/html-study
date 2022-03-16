var inputs_container, column_inputs_container_var,current_selection



inputs_container = document.getElementById("inputs-container")
column_inputs_container_var = 0
all_column_names = ['date', 'Before Translation', 'Review', 'Author', 'Location',
'Before Pronoun Resolution', 'Brand', 'Product Rating', 'Review Rating',
'SKU', 'Source', 'root', 'title', 'week split', 'Aspect',
'Context Aspect', 'Sentence', 'Combined Max Score', 'Overall Sentiment',
'Sentiment Score', 'Sentiment Confidence', 'Clustering Confidence',
'Context Aspect Group', 'Aspect Sentiment', 'Aspect Sentiment Score',
'Context Aspect Sentiment', 'Context Aspect Sentiment Score',
'Context Aspect Group Sentiment',
'Context Aspect Group Sentiment Score']

// Add column names button received from python
for(let i=0; i< all_column_names.length;i++){
    column_name = all_column_names[i]
    all_column_container_div = document.getElementById("all-column-names-container")
    column_button = document.createElement("input")
    column_button.setAttribute("type","button")
    column_button.setAttribute("value",column_name)
    column_button.setAttribute("class","all-column-names-button")
    column_button.setAttribute("id",`button_id_${column_name}`)
    column_button.setAttribute("onclick","sendColumnToInput(this.value)")
    all_column_container_div.appendChild(column_button)
    
}


//Check Input

function checkInput(){
    column_names_to_check = document.getElementsByClassName("column-names-input")
    columns_user_has_added = []
    for(let i = 0; i< column_names_to_check.length ; i++){
        input_string = column_names_to_check[i].value
        if (input_string.length > 1){
            input_string.split(",").forEach((el)=>{
                columns_user_has_added.push(el)             
            })  
        }
    }
    for(let i = 0; i < all_column_names.length ; i++){
        el =  all_column_names[i]
        if(columns_user_has_added.includes(el)){
            document.getElementById(`button_id_${el}`).style.background='#E0E0E0'
        }else{
            document.getElementById(`button_id_${el}`).style.background= "#FFD700"
        }
    }
}


// Set current focus

function setCurrentFocus(id){
    current_selection = id
    checkInput();
}





// Send column name to input

function sendColumnToInput(column_name){
    if(current_selection.includes("column_names_input_")){
        existing_value_in_column_names_input = document.getElementById(current_selection).value
        if(existing_value_in_column_names_input.length > 0){
            document.getElementById(current_selection).value = existing_value_in_column_names_input + `,${column_name}`
        }else{
            document.getElementById(current_selection).value = column_name
        }
    }else{
    document.getElementById(current_selection).value = column_name
    }
    // Check after sending to input
    checkInput();
}




function addMore(){
    // adding child input container
    column_inputs_container = document.createElement("div")
    /* rm is used to later remove this when user press remove*/
    column_inputs_container.setAttribute("class",`column-inputs-container rm_${column_inputs_container_var}`) 
    inputs_container.appendChild(column_inputs_container)


    // adding header input
    header_input = document.createElement("input")
    header_input.setAttribute("type","input")
    header_input.setAttribute("placeholder","Header")  
    header_input.setAttribute("oninput","checkInput()")  
    header_input.setAttribute("id",`header_input_${column_inputs_container_var}`)
    header_input.setAttribute("onclick","setCurrentFocus(this.id)")
    header_input.setAttribute("class",`header-input rm_${column_inputs_container_var} process-input-field`)
    column_inputs_container.appendChild(header_input)


    // adding column names
    column_names_input = document.createElement("input")
    column_names_input.setAttribute("type","input")
    column_names_input.setAttribute("placeholder","Column Names") 
    column_names_input.setAttribute("id",`column_names_input_${column_inputs_container_var}`)
    column_names_input.setAttribute("onclick","setCurrentFocus(this.id)")
    column_names_input.setAttribute("oninput","checkInput()")    

    column_names_input.setAttribute("class",`column-names-input rm_${column_inputs_container_var} process-input-field`)
    column_inputs_container.appendChild(column_names_input)

    // adding remove button
    remove_button = document.createElement("input")
    remove_button.setAttribute("type","button")
    remove_button.setAttribute("value","Remove")
    remove_button.setAttribute("class",`remove-button rm_${column_inputs_container_var}`)
    remove_button.setAttribute("onclick","removeInputDiv(this)")
    column_inputs_container.appendChild(remove_button)

    // Setting focus to current column names input
    current_selection = `column_names_input_${column_inputs_container_var}`

     // set focus to current div when user press add
     column_inputs_container.scrollIntoView();


     // Check Input
     checkInput();

     // adding column_inputs_container_var 
     column_inputs_container_var ++

    
}

// Remove button function
function removeInputDiv(button){
    rm_class = `${button.className}`.split(" ")
    rm_class = rm_class[rm_class.length - 1]
    document.querySelectorAll(`.${rm_class}`).forEach(el => el.remove());
     // Check Input
     checkInput();
}

//adding input container once for aesthetic purpose
addMore();






