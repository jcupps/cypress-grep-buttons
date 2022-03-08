# cypress-grep-buttons
Adds buttons to each test and suite in the Cypress test runner UI to grep the output to that test/suite name

![cypress-grep-ui](https://user-images.githubusercontent.com/11245717/157295895-41fca029-fb7a-49d3-871c-ce594fe08114.gif)

To use, import in cypress/support/index.js and invoke:
```javascript
// cypress/support/index.js

import cypressGrep from 'cypress-grep'; // Required dependency
import addGrepButtons from ' jcupps/cypress-grep-buttons';

cypressGrep();
addGrepButtons();
```
