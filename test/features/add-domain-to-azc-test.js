describe("Add domain to Amazon Container", () => {
  let webExtension, background;

  beforeEach(async () => {
    webExtension = await loadWebExtension();
    background = webExtension.background;
  });

  describe("runtime message add-to-amazon-container", () => {
    beforeEach(async () => {
      await background.browser.runtime.onMessage.addListener.yield("add-to-amazon-container", {
        url: "https://example.com"
      });
    });

    describe("runtime message what-sites-are-added", () => {
      it("should return the added sites", async () => {
        const [promise] = await background.browser.runtime.onMessage.addListener.yield("what-sites-are-added", {});
        const sites = await promise;
        expect(sites.includes("example.com")).to.be.true;
      });
    });


    describe("runtime message removeDomain", () => {
      it("should have removed the domain", async () => {
        await background.browser.runtime.onMessage.addListener.yield({
          removeDomain: "example.com"
        }, {});

        const [promise] = await background.browser.runtime.onMessage.addListener.yield("what-sites-are-added", {});
        const sites = await promise;
        expect(sites.includes("example.com")).to.be.false;
      });
    });
  });

  describe("runtime message addDomain", () => {
    const addDomain = async domain => {
      const results = background.browser.runtime.onMessage.addListener.yield({addDomain: domain}, {});
      await Promise.all(results);
    };

    const getSites = async () => {
      const [promise] = background.browser.runtime.onMessage.addListener.yield("what-sites-are-added", {});
      return promise;
    };

    it("should add a bare domain", async () => {
      await addDomain("example.org");
      const sites = await getSites();
      expect(sites.includes("example.org")).to.be.true;
    });

    it("should add the host of a full URL", async () => {
      await addDomain("https://www.example.net/some/path?q=1");
      const sites = await getSites();
      expect(sites.includes("www.example.net")).to.be.true;
    });

    it("should ignore an invalid domain", async () => {
      await addDomain("not a domain");
      const sites = await getSites();
      expect(sites).to.deep.equal([]);
    });
  });

});
