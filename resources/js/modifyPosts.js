

window.addEventListener("load",(event)=>{
    console.log("The js has loaded into the window");

    const deleteButtons = document.getElementsByClassName('deleteButton');
    const editButtons = document.getElementsByClassName('editButton');
    async function deletePost(url,message){
        const result = await fetch(url,{
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        console.log(result);
        console.log(result.status);
        return result.status;
    }

    async function editPost(url, message){
        const result = await fetch(url, {
            method: "PUT",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        console.log(result);
        console.log(result.status);
        return result.status;
    }
    for(let button of deleteButtons){
        button.addEventListener("click",async()=>{
            let post_id = button.classList[1];
            let postContainer = button.parentElement.parentElement;
            console.log(postContainer);

            // lets create a reques to delete the post. 
            let url = window.location.href;

            url = url.split('users')[0];
            
            url = url + "api/deletePost";

            let message = {
                id: post_id
            }

            const status = await deletePost(url, message);

            if(status == 200){
                while(postContainer.firstChild){
                    postContainer.firstChild.remove();
                }
                postContainer.remove();
            }

        })
    }
    for(let button of editButtons){
        button.addEventListener("click",async()=>{
            console.log("the edit button was clicked");
            // we want to get the text of the post so lets get the parent element. 
            let parentElement = button.parentElement.parentElement;
            let contentContaner = parentElement.querySelector(".content");
            let post_text_content = contentContaner.textContent;

            // we want to selec the element with the class list hidden on it and set its display to be 
            let editPostContainer = document.querySelector('.editFormContainer');
            console.log(editPostContainer);
            // add the text to the text area so the user can edit the post;
            let textArea = editPostContainer.querySelector('.editTextArea');
            textArea.value= post_text_content;
            // display the hidden container so that the user can now edit the post
            editPostContainer.classList.remove('hide');
            // select the button for submission or cancel of new edit
            let canceButton = editPostContainer.querySelector('.cancel');
            let submitButton = editPostContainer.querySelector('.submit');

            canceButton.addEventListener('click',()=>{
                // if the cancel button was clicked we just want to make the editPostContainer to be hidden again;
                textArea.value = "Hello";
                editPostContainer.classList.add('hide');
            })
            submitButton.addEventListener('click', async()=>{
                // we want to submit a request to the server to edit the post. 
                // get the url 
                let content = textArea.value;
                let post_id = button.classList[1];

                let url = window.location.href;

                url = url.split('users')[0];
                
                url = url + "api/editPost";

                let message = {
                    id: post_id,
                    content: content,
                }

                const status = await editPost(url, message);

                if(status==200){
                    console.log("ya we edited the message");
                    // get the message content and set it to the post field. 
                    contentContaner.textContent = content;
                    editPostContainer.classList.add('hide');
                }
                else{
                    console.log("the message could not be edited");
                    editPostContainer.classList.add('hide');
                }

            })
        })
    }
})