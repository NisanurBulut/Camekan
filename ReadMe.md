---
# APP Main Screen UI  
[APP](https://github.com/NisanurBulut/Camekan/blob/master/Trailer.gif)
---
# Application Architecture
* The Repository Pattern
    -Seperation of concerns <br>
    -Minimise dublicate query logic <br>
    -Decouple business code from data access <br>
    -Testabilty <br>
    -Increased level of abstraction <br>
    -Increased level of maintainability, flexibility <br>
    -More Classes/Interfaces <br>
    -Business logic further away from data <br>
* Specification Pattern
* Error Handling and Exceptions
    -Developer exception page
    -Middleware
    -Swagger
    -Http response error
    -Custumize errors
    -Validations errors
##### For a specification pattern, we can simply say that it is a pattern that allows us to create reusable parts by encapsulating the domain information / rules we want.
* Related Data
* Seeding Data
* Pagination
    - Performance, Parameters passing by query string, Page size should be limited, It should always page results 
    - To be implementing sorting, searching and pagination functionality in a list using the specification pattern
    - Query commands are stored in variable
    - Execution of the query is deferred : ToList(), ToArray(), ToDictionary(), Count() or other singleton queries
* FlexBox
    - https://flexboxfroggy.com/#tr