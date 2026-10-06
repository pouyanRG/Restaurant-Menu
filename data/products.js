export const categories = ["All", "Burger", "Sides", "Chicken", "Pizza", "Drinks"];

// theme => CSS gradient class (see globals.css  .theme-*)
export const products = [
  { id: 1, name: "Burger King",   price: 8.5,  discount: 10, image: "/images/burger.webp",  category: "Burger", theme: "peach", imgClass: "img-burger" },
  { id: 2, name: "French Fries",  price: 4.5,  discount: 10, image: "/images/fries.webp",   category: "Sides",  theme: "black",  imgClass: "img-fries" },
  { id: 3, name: "Chicken", price: 15.5, discount: 10, image: "/images/chicken.webp", category: "Chicken", theme: "orange", imgClass: "img-chicken" },
  { id: 4, name: "Pizza",     price: 6.5,  discount: 10, image: "/images/pizza.webp",   category: "Pizza",  theme: "yellow",  imgClass: "img-pizza" },
  { id: 5, name: "Classic Cola",        price: 4.5,  discount: 10, image: "/images/drink-black.webp",   category: "Drinks", theme: "red",   imgClass: "img-drink" },
  { id: 6, name: "Blue Lagoon",        price: 5.5,  discount: 10, image: "/images/drink-blue.webp", category: "Drinks", theme: "blue", imgClass: "img-drink" }
];

export const navItems = [
  { id: "home", label: "Home" },
  { id: "message", label: "Message" },
  { id: "favorite", label: "Favorite" },
  { id: "profile", label: "Profile" }
];
