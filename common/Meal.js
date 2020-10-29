export default function Meal() {
    this.foods = [];

    this.addFood = (food) => {
        this.foods.push(food);
    }

    this.reset = () => {
        this.foods = [];
    }

    this.getLocation = function () {
        let location = [];
        this.foods.forEach((food) => {
            location = location.concat(food.getLocation());
        });

        return location;
    }
}