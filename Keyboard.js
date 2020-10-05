import LinkedList from "./LinkedList";

//fan out keydown publisher actions
export default function InputPublisher(event, subscriptions) {

    const queue = new LinkedList();
    

    const init = function () {
        //create eventlistener for keydown 
        //check for direction keys and set lastPressed
        document.addEventListener(event, function (e) {
            if(subscriptions.includes(e.key)){
                queue.add(e.key)
            }
        });
    };


    this.getNext = function(){
       return queue.remove();
    }

    this.isEmpty  = function(){
        return queue.isEmpty();
    }

    init();

}
