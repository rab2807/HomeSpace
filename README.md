# Home-Rental-System
A web app for seamless rental property booking. Home owners can register and list their rental homes, and tenants can browse and book. A messaging system facilitates the personal communication between owners and tenants to finalize the deal.

# Tech Stack
* NodeJS
* Express
* Handlebars
* Oracle

# Features
* Registration and Login as owners/tenants. **OracleDB** is used to save user info.
* Active sessions with cookies using **jsonwebtoken**
* Owners can register homes for rent with necessary details. **Multer.js** was used for multipart form data to handle images and other information.
* Users and homes have detailed history of previous rent deals. (for example, previous reneted homes with time periods of a tenant)
* A rating system for users and houses.
* A messaging system for owner-tenant communication.
