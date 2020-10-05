export default function LinkedList() {
    let head = undefined;
    let tail = undefined;
    let size = 0;


    this.add = function (item) {
        if (!head) {
            head = new Node(item);
            tail = head;
        } else {
            const n = new Node(item);
            tail.next = n;
            tail = n;
        }
        size++;
    }

    this.remove = function () {
        if (!head) return;
        const first = head.item;
        head = head.next;
        size--;
        return first;
    }

    // this.removeTail = function () {
    //     if (!head) return;
    //     const last = tail.item;
    //     if (size == 1) {
    //         head = null;
    //         tail = null;
    //         return last;
    //     } else if (size > 1) {
    //         while(head.next)
    //     }

    // }

    this.getSize = function () {
        return size;
    }

    this.isEmpty = function () {
        return size == 0;
    }
}

function Node(item) {
    this.item = item;
    this.next = undefined;
}