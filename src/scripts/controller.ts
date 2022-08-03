const controllerList = [
    
];

const controllerChecker = () => {
    controllerList.forEach((controller) => {
        if (document.querySelector(controller.selector)) controller.callback();
    })
}

export default controllerChecker;