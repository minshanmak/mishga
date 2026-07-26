# MishGa Website Customization Guide

## Main website content

- `index.html` contains the page sections, headings, footer details, links, and contact text.
- `css/style.css` contains the main website styles.
- `js/main.js` contains the navigation, animations, contact form, and public project display logic.

## Brand settings

- Logo: replace `assets/mishga-logo.png`.
- Tab icon: uses the same logo through the favicon link in each HTML page.
- Main colors: edit `--black`, `--gold`, and `--white` at the top of `css/style.css`.

## Contact details

In `index.html`, search for these values and replace them with your own:

- `hello@mishga.in`
- `+91 90000 00000`
- `India · Working worldwide`

## Admin and projects

- Login page: `/admin`
- Enquiry dashboard: `/dashboard`
- Projects manager: `/projects`
- Backend API and database logic: `app.py`

Create, edit, publish, or delete projects in the Projects manager. Published projects are shown on the public portfolio automatically.

## Email notifications

Create a `.env` file beside `app.py`, based on `.env.example`. Keep Gmail app passwords private and never add `.env` to a public repository.
