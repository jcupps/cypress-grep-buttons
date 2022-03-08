/* global after */

const warningElId = 'grep-active-warning';

function removeWarning() {
  const { document } = window.top;
  document.getElementById(warningElId).remove();
}

function addWarning() {
  const { document } = window.top;

  const warning = document.createElement('div');
  warning.id = warningElId;
  warning.textContent = `Showing only tests/suites containing this text: "${window.top.activeCyGrep}"`;
  warning.style.background = '#ffeeb0';
  warning.style.color = '#8f7000';
  warning.style.fontSize = '0.9em';
  warning.style.fontStyle = 'italic';
  warning.style.padding = '5px 10px';

  const warningIcon = document.createElement('span');
  warningIcon.className = 'fas fa-exclamation-triangle';
  warningIcon.style.marginRight = '5px';
  warning.prepend(warningIcon);

  document.querySelector('.reporter > .container').prepend(warning);
}

/**
 * Adds a button next to each test and suite in the Cypress test runner UI to filter the tests by
 * grepping the name of the test or suite. Relies on https://github.com/cypress-io/cypress-grep.
 */
export default function addGrepButtons() {
  after(() => {
    const { document } = window.top;

    const testsAndSuites = document.querySelectorAll('.test.runnable, .suite.runnable');
    const grepTestsBtnClass = 'grep-tests-btn';

    [...testsAndSuites].forEach((t) => {
      const header = t.querySelector('.collapsible-header');
      const title = header.querySelector('.runnable-title');
      const testName = title.innerText.split('\n')[0];

      // Don't add the button if it already exists
      if (header.querySelector(`.${grepTestsBtnClass}`) && header.querySelector(`.${grepTestsBtnClass}`).length) {
        return;
      }

      const isActiveGrep = window.top.activeCyGrep === testName;

      const btnTitle = isActiveGrep
        ? 'Click to remove this filter'
        : 'Click to run only tests/suites matching this name';

      const grepTestsBtn = document.createElement('button');
      grepTestsBtn.className = grepTestsBtnClass;
      grepTestsBtn.style.background = 'none';
      grepTestsBtn.style.color = 'inherit';
      grepTestsBtn.style.padding = '0 3px';
      grepTestsBtn.style.verticalAlign = 'baseline';
      grepTestsBtn.title = btnTitle;
      grepTestsBtn.onclick = () => {
        if (isActiveGrep) {
          window.top.Cypress.grep();
          window.top.activeCyGrep = null;
          removeWarning();
          console.log('clearing grep');
        } else {
          window.top.Cypress.grep(testName);
          window.top.activeCyGrep = testName;
          addWarning();
          console.log(`grepping tests to "${testName}"`);
          console.log(`grepped in spec: ${window.top.Cypress.spec.name}`);
        }
      };

      // Add visually hidden text for screen-readers
      const textSpan = document.createElement('span');
      textSpan.textContent = btnTitle;
      textSpan.className = 'visually-hidden';
      grepTestsBtn.appendChild(textSpan);

      // Add an icon
      const iconSpan = document.createElement('span');
      iconSpan.className = `fas fa-${isActiveGrep ? 'ban' : 'arrow-right'}`;
      grepTestsBtn.appendChild(iconSpan);

      header.querySelector('.runnable-controls').appendChild(grepTestsBtn);
    });
  });
}
