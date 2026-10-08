const addDomainForm = document.getElementById("add-domain-form");
const domainInput = document.getElementById("domain-input");
const formError = document.getElementById("form-error");
const domainList = document.getElementById("domain-list");
const emptyMessage = document.getElementById("empty-message");

function normalizeDomain (value) {
  try {
    return new URL(value).host.toLowerCase();
  } catch (e) {
    try {
      return new URL(`https://${value}`).host.toLowerCase();
    } catch (e2) {
      return null;
    }
  }
}

async function getAddedDomains () {
  const domains = await browser.runtime.sendMessage("what-sites-are-added");
  return Array.isArray(domains) ? domains : [];
}

async function renderDomains () {
  const domains = await getAddedDomains();
  domainList.textContent = "";
  emptyMessage.hidden = domains.length > 0;
  for (const domain of domains) {
    const item = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = domain;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", async () => {
      await browser.runtime.sendMessage({removeDomain: domain});
      await renderDomains();
    });
    item.appendChild(name);
    item.appendChild(removeButton);
    domainList.appendChild(item);
  }
}

addDomainForm.addEventListener("submit", async event => {
  event.preventDefault();
  formError.hidden = true;
  const domain = normalizeDomain(domainInput.value.trim());
  if (!domain) {
    formError.textContent = "Enter a valid domain, for example example.com.";
    formError.hidden = false;
    return;
  }
  await browser.runtime.sendMessage({addDomain: domain});
  domainInput.value = "";
  await renderDomains();
});

renderDomains();
