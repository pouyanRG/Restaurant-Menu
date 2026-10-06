export const categories = ["All", "Burger", "Sides", "Chicken", "Pizza", "Drinks"];

// theme => CSS gradient class (see globals.css  .theme-*)
export const products = [
  { id: 1, name: "Burger King",   price: 8.5,  discount: 10, image: "/images/burger.png",  category: "Burger", theme: "orange", imgClass: "img-burger" },
  { id: 2, name: "French Fries",  price: 4.5,  discount: 10, image: "/images/fries.png",   category: "Sides",  theme: "green",  imgClass: "img-fries" },
  { id: 3, name: "Chicken Bucket", price: 15.5, discount: 10, image: "/images/chicken.png", category: "Chicken", theme: "red", imgClass: "img-chicken" },
  { id: 4, name: "Pizza Hut",     price: 6.5,  discount: 10, image: "/images/pizza.png",   category: "Pizza",  theme: "peach",  imgClass: "img-pizza" },
  { id: 5, name: "Drinks",        price: 4.5,  discount: 10, image: "/images/drink-blue.svg",   category: "Drinks", theme: "blue",   imgClass: "img-drink" },
  { id: 6, name: "Drinks",        price: 5.5,  discount: 10, image: "/images/drink-yellow.svg", category: "Drinks", theme: "yellow", imgClass: "img-drink" }
];

export const navItems = [
  { id: "home", label: "Home" },
  { id: "message", label: "Message" },
  { id: "favorite", label: "Favorite" },
  { id: "profile", label: "Profile" }
];
