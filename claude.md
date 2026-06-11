# Claude Code Instructions: Food Menu WebApp Development

## Main Objective
Develop a strictly **Mobile First** "Food Menu" web application. The app will allow customers to select products, fill in their personal details in a pop-up, and send the complete order via WhatsApp. Additionally, it must include a simple administration section.

## UX/UI Design (IMPORTANT)
You must use the following skill as a mandatory baseline for UX/UI design:
[Taste Skill - GitHub](https://github.com/Leonxlnx/taste-skill)

Please review that repository and rigorously apply its design principles, components, micro-interactions, and visual aesthetics. The final design should not look generic, but rather premium, dynamic, and highly engaging.

## Tech Stack and Framework
- **Framework**: Vite with React (TypeScript recommended).
- **Styles**: Follow the *Taste Skill* guidelines.
- **State Management**: Context API or Zustand (to manage the shopping cart state and editable menu data).
- **Routing**: React Router (to separate the client view and the admin view).

## Initialization Commands
You must run the following commands to bootstrap the project (adjust according to Taste Skill needs if necessary):

```bash
# Create the project in the current directory (if empty) or in a new folder
npx create-vite@latest . --template react-ts
# If the folder is not empty, create a subfolder: npx create-vite@latest app-menu --template react-ts

# Install dependencies
npm install

# Install recommended dependencies for icons and routing
npm install react-router-dom lucide-react
```

## Requirements and Features

### 1. Client View (Mobile First)
- **Menu Categories**:
  - **Main Course** ("Principal"): 3 different dishes.
  - **Side Dish** ("Acompañamiento"): 2 different dishes.
- **Item Display (Drop-down)**: 
  - Each menu item must be an expandable element (accordion/drop-down).
  - When expanded, it must show a **representative image of the product**, its description, price, and the option to add to the order (with a quantity selector).
- **Checkout Pop-up**: 
  - Once the customer selects what they want to order, they should be able to open a confirmation/checkout pop-up.
  - The pop-up must have a form requesting the customer's personal data (Name, Address, Payment Method, etc.).
- **WhatsApp Integration**: 
  - Upon confirmation in the pop-up, a pre-filled WhatsApp message must be generated including the customer's personal data and the complete order details.
  - The link must automatically redirect to the company's chat using the WhatsApp API (`https://wa.me/`).
  - **Company Number**: `+54 9 1126541523` (API format: `5491126541523`).

### 2. Admin View
- **Route**: `/admin`
- **Permissions and Functions**: 
  - The **only** functionality of this view is to allow the administrator to edit each menu item.
  - It must allow modification of: Dish name, Description, Price, and Image.
  - *Note*: To simplify this phase, you can use `localStorage` to persist the changes made by the admin, so they reflect on the client view without needing an external database setup.

## Execution Steps for Claude
1. **Initialization**: Run the commands to initialize Vite and clean up unnecessary boilerplate code.
2. **Design Setup**: Integrate the styles and principles from the *Taste Skill*.
3. **Data Structure**: Create the initial state (mock data) with the categories and the 5 required dishes. Set up the logic to read/write this to `localStorage`.
4. **UI Components (Client)**: Develop the menu, focusing on the drop-downs with images and the mobile-first design.
5. **Order Logic**: Implement the current order state (shopping cart) and the User Data Pop-up.
6. **WhatsApp Integration**: Develop the function that formats the order and opens the WhatsApp link.
7. **Admin Panel**: Develop the panel to edit the product information.
8. **Final Review**: Ensure that the micro-animations and aesthetics meet a premium standard.
