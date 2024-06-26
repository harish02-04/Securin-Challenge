# CVE Information Management System

## Project Overview

This project aims to develop a CVE (Common Vulnerabilities and Exposures) Information Management System. It consumes data from the CVE API provided by NIST (National Institute of Standards and Technology) and stores it in a database. The system periodically synchronizes CVE details into the database in batch mode and provides APIs to read and filter CVE information. Additionally, it applies data cleansing and de-duplication techniques to ensure data quality.

## Approach

### Technologies Used

- **Frontend**: React.js
- **Backend**: Express.js (Node.js)
- **Database**: MySQL

### Server-side Functions

#### Periodical Database Updation

- Utilizes Node.js to periodically synchronize CVE details into a MySQL database from the CVE API.
- Data fetching from the API is done in small chunks to efficiently handle potentially large datasets.
- Ensures data consistency by checking for duplicates before insertion.
- Scheduled synchronization of the database with the API at specific time intervals.

### REST API’s with ExpressJs

- Provides RESTful API endpoints to interact with the CVE data stored in the MySQL database.
- Supports pagination and sorting of dates to efficiently handle large datasets.
- Retrieves detailed information about specific CVEs by performing JOIN operations on multiple tables.

### Client-side Functions

#### Components

- **App Component**: Entry point for the React application, defines routes using React Router.
- **List Component**: Displays a list of CVEs retrieved from the server, with pagination controls.
- **Details Component**: Displays detailed information about a specific CVE fetched from the server.

#### Inline CSS

- Utilizes inline CSS for styling components to avoid overlapping styles and maintainability.

## Database Structure

### Tables

1. **main Table**: Holds basic information about CVEs.
   - id (Auto-incremented primary key)
   - cvid (Unique id for the CVE)
   - identifier (Additional identifier for the CVE)
   - publisher (Date when the CVE was published)
   - lastmod (Date when the CVE was last modified)
   - status (Status of the CVE)

2. **expo Table**: Stores detailed descriptions and scores of CVEs.
   - id (Auto-incremented primary key)
   - cvid (Foreign key referencing the cvid column in the main table)
   - descrip (Description of the CVE)
   - score (BaseScore associated with the CVE)
   - severe (Severity of the CVE)
   - vecst (Vector string of the CVE)
   - acvec (Access vector of the CVE)
   - accom (Access complexity of the CVE)
   - auth (Authentication)
   - cimp (Confidentiality impact of the CVE)
   - Iimp (Integrity impact of the CVE)
   - aimp (Availability impact of the CVE)
   - escore (Exploitability score of the CVE)
   - iscore (Impact score of the CVE)

3. **config Table**: Stores configuration-related information for CVEs.
   - id (Auto-incremented primary key)
   - cvid (Foreign key referencing the cvid column in the main table)
   - vulnerable (Indicates if the system is vulnerable to the CVE)
   - criteria (Criteria for vulnerability assessment)
   - matchCriteriaId (Identifier for matching criteria)

## Screenshots

### 1.Main Page

<img width="953" alt="img1" src="https://github.com/harish02-04/Securin-Challenge/assets/121707427/0d675f3d-6436-4d41-a28e-9fcad709fad6">


### 2.Details Page

<img width="955" alt="img2" src="https://github.com/harish02-04/Securin-Challenge/assets/121707427/ae6ff8c4-a605-4eed-a78c-3fe7c6e59bba">

