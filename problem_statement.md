# Hackathon Problem Statement: Digital Kudos Wall (Web App)

## Background

Some reading about Kudos cards if you are not familiar with it - [Kudo Box & Kudo Cards Nurture Intrinsic Motivation - Management 3.0 Practice](https://management30.com/practice/kudo-cards/) [Gratitude is True Intrinsic Motivation, Send a Kudo Today!](https://management30.com/blog/gratitude-is-true-intrinsic-motivation-send-a-kudo-today/) [cite: 1]

We want to foster a culture of appreciation by building a digital kudos wall that lets colleagues publicly recognise each other’s great work. [cite: 2] The system should be simple to use, visually appealing, and easy to extend. [cite: 3]

**Note**: The requirements outlined below are intentionally kept high-level and not overly detailed. [cite: 4] Teams are encouraged to extend or adapt them to meet the overarching goals. [cite: 5] A basic high-fidelity desktop design is provided as a reference for UI and UX. [cite: 6]

## Core Requirements

### Web App

Develop a straightforward web application (no Slack, mobile, or AI integrations). [cite: 7]

### User Roles

Introduce two user roles: [cite: 8]

- **Tech Lead**: Can create and view kudos. [cite: 8]
- **Team Member**: Can only view kudos. [cite: 8]

### Kudos Entry

When a Tech Lead creates a kudos, they must specify (all mandatory): [cite: 9]

- **Recipient’s Name** (the individual’s name). (Text) [cite: 9, 10]
- **Team Name** (the department or team). (Static dropdown of items) [cite: 10]
- **Category** (e.g., Teamwork, Innovation, Helping Hand) (Static dropdown of items) [cite: 10]
- **Short message** explaining why they deserve recognition (Text). [cite: 10]

### Kudos Wall

A main page that displays all kudos publicly. [cite: 11] Users can filter or search kudos by recipient, team, or category. [cite: 12]

### Authentication

Simple Email/Password Signup/Login: [cite: 12]

- Users can register using their company email address and password. [cite: 12]
- After logging in, they can create and view kudos. [cite: 13]
- Ensure basic security measures for password storage and user sessions. [cite: 13]

### Layered Architecture & SOPs (Standard Operating Procedures)

- Implement a layered architecture (e.g., presentation, business logic, data access). [cite: 14]
- Define and follow SOPs covering design patterns, naming conventions, file/folder organization, coding guidelines and writing tests which Cursor can follow when writing code. [cite: 15]
- Keep the code structure maintainable and easy to extend. [cite: 16]

### Analytics Dashboard

Include a basic analytics view that shows:

- Top recognised individuals or teams. [cite: 16]
- Provide options to view results over specific periods (weekly, monthly, quarterly, yearly) to see who’s getting the most kudos. [cite: 17]
- Trending words or categories. [cite: 18]
  - For example, if certain keywords (like “collaboration” or “customer-first”) often appear in kudos messages, or if a particular category (e.g., “Teamwork”) dominates, highlight these as trending. [cite: 18]
- This dashboard should provide useful insights into how kudos are being used. [cite: 19]

### Automated Testing

- Implement automated testing to ensure the reliability and correctness of core features. [cite: 20]
- Include unit tests to verify individual functions and components. [cite: 21]
- Include integration tests to ensure different parts of the system (for ex: test APIs like in rev-proxy, top level integration tests in lancer) work smoothly together. [cite: 21]
- The tests should provide reasonable coverage of the main functionalities (e.g., kudos creation, retrieval, filtering, authentication, and analytics). [cite: 22]

### Deployment / Demo

- Provide a working demo by the end of the hackathon. [cite: 23]
- A local container (Docker) or a quick cloud deployment is recommended for demonstration. [cite: 24]

## Brownie Points (Optional Enhancements)

- **Send Notifications to Basecamp**: When a kudo is given, a small message will automatically be posted in a designated Basecamp project. [cite: 25]
- **User Profiles**: Each user has a profile page listing the kudos they’ve received. [cite: 26]

## Evaluation Criteria

- **Feature Completion (40%)**: Core functionalities (create & display kudos, basic auth, analytics) must be finished and demo-ready. [cite: 27]
- **Layered Architecture (20%)**: Cleanly separated concerns, maintainable structure, design patterns where appropriate. [cite: 28]
- **Automation Testing (20%)**: Quality and coverage of automated tests. [cite: 28]
- **Standard Operating Procedures Adherence (20%)**: Well-defined coding and testing standards, consistently implemented using Cursor AI Editor. [cite: 29]

## Summary

The main focus is building a simple web-based Kudos Wall where employees can sign up, log in, and post kudos. [cite: 29] The kudos creation requires a recipient, a team name, a mandatory category, and a short appreciation message. [cite: 30] We also need a basic analytics dashboard for insights. [cite: 31] While the authentication is kept simple (email/password), we emphasise best practices—layered architecture, SOP-driven coding, and automated testing—to keep the project functional and future-proof. [cite: 31] Brownie points for integrating notifications to Basecamp, user profiles, and other fun extras to enhance engagement. [cite: 32]
