export const categories = ["All", "Burger", "Sides", "Chicken", "Pizza", "Steak", "Drinks"];

export const products = [
  {
    id: 3, name: "Burger King", price: 8.5, discount: 10, image: "/images/burger.webp",
    category: "Burger", theme: "peach", imgClass: "img-burger",
    description: "A juicy beef patty with melted cheese, fresh lettuce and our house sauce.",
    time: 10, rating: 4.5, calories: 540,
    ingredients: ["Beef", "Cheese", "Lettuce", "Tomato", "Bun"]
  },
  {
    id: 6, name: "Cheese Fries", price: 4.5, discount: 10, image: "/images/Cheese-Fries.webp",
    category: "Sides", theme: "black", imgClass: "img-fries",
    description: "Golden, crispy fries seasoned with a touch of sea salt.",
    time: 8, rating: 4.6, calories: 365,
    ingredients: ["Potatoes", "Sea salt", "Vegetable oil"]
  },
  {
    id: 5, name: "Chicken", price: 15.5, discount: 10, image: "/images/chicken.webp",
    category: "Chicken", theme: "orange", imgClass: "img-chicken",
    description: "Crispy, tender chicken pieces seasoned with our signature spices.",
    time: 18, rating: 4.7, calories: 680,
    ingredients: ["Chicken", "Flour", "Spices", "Vegetable oil"]
  },
  {
    id: 4, name: "Pizza", price: 6.5, discount: 10, image: "/images/pizza.webp",
    category: "Pizza", theme: "yellow", imgClass: "img-pizza",
    description: "Freshly baked pizza topped with tomato sauce, cheese and herbs.",
    time: 15, rating: 4.4, calories: 590,
    ingredients: ["Dough", "Tomato sauce", "Mozzarella", "Herbs"]
  },
  {
    id: 18, name: "Classic Cola", price: 4.5, discount: 10, image: "/images/drink-black.webp",
    category: "Drinks", theme: "red", imgClass: "img-drink",
    description: "A refreshing, ice-cold classic cola.",
    time: 2, rating: 4.3, calories: 150,
    ingredients: ["Carbonated water", "Cola syrup", "Ice"]
  },
  {
    id: 19, name: "Blue Lagoon", price: 5.5, discount: 10, image: "/images/drink-blue.webp",
    category: "Drinks", theme: "blue", imgClass: "img-drink",
    description: "A cool, citrusy blue drink served over ice.",
    time: 3, rating: 4.5, calories: 180,
    ingredients: ["Lemon", "Blue syrup", "Carbonated water", "Ice"]
  },
  {
    id: 5, name: "Hot Dog", price: 5.5, discount: 10, image: "/images/hot-dog.webp",
    category: "Burger", theme: "orange", imgClass: "img-hot-dog",
    description: "A grilled sausage in a soft bun with classic toppings.",
    time: 8, rating: 4.2, calories: 410,
    ingredients: ["Sausage", "Bun", "Mustard", "Onion"]
  },
  {
    id: 8, name: "Alfredo Pasta", price: 3.5, discount: 15, image: "/images/penne-pasta.webp",
    category: "Sides", theme: "blue", imgClass: "img-pasta",
    description: "Creamy Alfredo sauce tossed with tender pasta and parmesan.",
    time: 14, rating: 4.6, calories: 620,
    ingredients: ["Pasta", "Cream", "Parmesan", "Butter"]
  },
  {
    id: 9, name: "Caesar Salad", price: 7.0, discount: 10, image: "/images/salad.webp",
    category: "Sides", theme: "green", imgClass: "img-caesar",
    description: "Crispy or grilled roll with lettuce, special Caesar dressing, cherry tomatoes, olives, croutons, and grated Parmesan cheese.",
    time: 7, rating: 4.4, calories: 240,
    ingredients: ["Crispy or grilled roll", "Lettuce", "Special Caesar dressing", "Cherry tomatoes", "Olives", "Croutons", "Grated Parmesan cheese"]
  },
  {
    id: 20, name: "doogh", price: 4.0, discount: 5, image: "/images/doogh.webp",
    category: "Drinks", theme: "blue", imgClass: "img-drink",
    description: "Bright, freshly squeezed orange juice.",
    time: 3, rating: 4.7, calories: 112,
    ingredients: ["Orange"]
  },
  {
    id: 1, name: "Pepperoni Pizza", price: 8.5, discount: 10, image: "/images/Pepperoni-pizza.webp",
    category: "Pizza", theme: "yellow", imgClass: "img-pizza",
    description: "Freshly baked pizza topped with pepperoni, tomato sauce and melted cheese.",
    time: 18, rating: 4.6, calories: 680,
    ingredients: ["Dough", "Pepperoni", "Tomato sauce", "Mozzarella"]
  },
  {
    id: 2, name: "Garlic Steak Pizza", price: 10.5, discount: 10, image: "/images/Garlic-Steak-Pizza.webp",
    category: "Pizza", theme: "orange", imgClass: "img-pizza",
    description: "A savory pizza topped with tender steak, garlic and melted cheese.",
    time: 20, rating: 4.7, calories: 720,
    ingredients: ["Dough", "Steak", "Garlic", "Mozzarella"]
  },
  {
    id: 7, name: "Steak", price: 18.5, discount: 10, image: "/images/grilled-steaks.webp",
    category: "Steak", theme: "orange", imgClass: "img-chicken",
    description: "A grilled steak seasoned with savory herbs and spices.",
    time: 25, rating: 4.7, calories: 620,
    ingredients: ["Beef steak", "Herbs", "Spices"]
  },
  {
    id: 10, name: "Soup", price: 4.0, discount: 5, image: "/images/Soup.webp",
    category: "Sides", theme: "green", imgClass: "img-pasta",
    description: "A warm, comforting soup made with fresh ingredients.",
    time: 10, rating: 4.5, calories: 220,
    ingredients: ["Vegetable broth", "Vegetables", "Herbs"]
  }
];

export const getProduct = (id) => products.find((p) => p.id === Number(id));

export const navItems = [
  { id: "home", label: "Home" },
  { id: "message", label: "Message" },
  { id: "favorite", label: "Favorite" },
  { id: "profile", label: "Profile" }
];
