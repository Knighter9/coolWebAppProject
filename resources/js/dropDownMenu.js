

window.addEventListener("load",(event)=>{
    console.log("The js has loaded into the window");

    const hamburgerMenu = document.querySelector('.hamburgerContainer');

    const linkContainer = document.querySelector('.linkContainer');

    const header = document.querySelector('header');
    hamburgerMenu.addEventListener('click',()=>{
        console.log("The hamburger menu has been clicked");
        if(header.classList.contains('headerLong')){
            header.classList.remove('headerLong');
            header.classList.add('header')
            linkContainer.classList.add('hide');
        }
        else{
            header.classList.add('headerLong');
            header.classList.remove('header');
            linkContainer.classList.remove('hide');
        }
    })
    
})