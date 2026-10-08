const path = require("path");
const webExtensionsJSDOM = require("webextensions-jsdom");

const waitFor = () => new Promise(resolve => setTimeout(resolve, 25));

describe("Options", () => {
  let background, page;

  beforeEach(async () => {
    const webExtension = await loadWebExtension();
    background = webExtension.background;
    const browser = background.browser;
    browser.runtime.sendMessage.callsFake(function () {
      const [result] = browser.runtime.onMessage.addListener.yield(...arguments);
      return result;
    });
    page = await webExtensionsJSDOM.fromFile(path.resolve(__dirname, "../../src/options.html"), {
      browser,
      sinon: global.sinon
    });
    await waitFor();
  });

  afterEach(async () => {
    if (page) {
      await page.destroy();
    }
  });

  const submitDomain = async domain => {
    page.document.getElementById("domain-input").value = domain;
    page.document.getElementById("add-domain-form").dispatchEvent(
      new page.window.Event("submit", {bubbles: true, cancelable: true})
    );
    await waitFor();
  };

  const listedDomains = () => {
    return Array.from(page.document.querySelectorAll("#domain-list li span"))
      .map(element => element.textContent);
  };

  it("should start with no custom domains", async () => {
    expect(listedDomains()).to.deep.equal([]);
    expect(page.document.getElementById("empty-message").hidden).to.be.false;
  });

  it("should add a domain", async () => {
    await submitDomain("https://www.example.com/some/path");
    expect(listedDomains()).to.deep.equal(["www.example.com"]);

    const stored = await background.browser.storage.local.get();
    expect(stored.domainsAddedToAmazonContainer).to.deep.equal(["www.example.com"]);
  });

  it("should report an invalid domain", async () => {
    await submitDomain("not a domain");
    expect(listedDomains()).to.deep.equal([]);
    expect(page.document.getElementById("form-error").hidden).to.be.false;
  });

  it("should remove a domain", async () => {
    await submitDomain("example.com");
    page.document.querySelector("#domain-list li button").click();
    await waitFor();

    expect(listedDomains()).to.deep.equal([]);
    expect(page.document.getElementById("empty-message").hidden).to.be.false;
    const stored = await background.browser.storage.local.get();
    expect(stored.domainsAddedToAmazonContainer).to.deep.equal([]);
  });
});
