import { generateChecklist, type ChecklistTemplate } from "./checklist-templates";

describe("generateChecklist", () => {
  it("returns base checklist items for empty product selection", () => {
    const checklist = generateChecklist({
      industryId: "nonexistent",
      verticalId: "nonexistent",
      productIds: [],
    });
    // Should have at least the 16 base items
    expect(checklist.length).toBeGreaterThanOrEqual(16);
  });

  it("includes items from all 4 stages", () => {
    const checklist = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: [],
    });
    const stages = new Set(checklist.map((c) => c.stage));
    expect(stages).toContain("plan");
    expect(stages).toContain("build");
    expect(stages).toContain("launch");
    expect(stages).toContain("grow");
  });

  it("is sorted by sortOrder ascending", () => {
    const checklist = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: ["patient-portal"],
    });
    for (let i = 1; i < checklist.length; i++) {
      expect(checklist[i].sortOrder).toBeGreaterThanOrEqual(
        checklist[i - 1].sortOrder
      );
    }
  });

  it("adds 3 items per selected product (Design, Implement, Test)", () => {
    const withoutProducts = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: [],
    });
    const withOneProduct = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: ["patient-portal"],
    });
    expect(withOneProduct.length).toBe(withoutProducts.length + 3);
  });

  it("generates Design, Implement, Test items for each product", () => {
    const checklist = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: ["patient-portal"],
    });
    const productItems = checklist.filter((c) =>
      c.title.includes("Patient Portal")
    );
    expect(productItems).toHaveLength(3);
    expect(productItems.some((c) => c.title.startsWith("Design "))).toBe(true);
    expect(productItems.some((c) => c.title.startsWith("Implement "))).toBe(true);
    expect(productItems.some((c) => c.title.startsWith("Test "))).toBe(true);
  });

  it("handles multiple products", () => {
    const checklist = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: ["patient-portal", "telemedicine"],
    });
    const baseCount = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: [],
    }).length;
    expect(checklist.length).toBe(baseCount + 6); // 3 per product * 2
  });

  it("skips unknown product IDs gracefully", () => {
    const checklist = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: ["nonexistent-product"],
    });
    const baseCount = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: [],
    }).length;
    expect(checklist.length).toBe(baseCount); // no extra items
  });

  it("returns only base checklist for unknown industry", () => {
    const checklist = generateChecklist({
      industryId: "nonexistent",
      verticalId: "whatever",
      productIds: ["something"],
    });
    const baseCount = generateChecklist({
      industryId: "nonexistent",
      verticalId: "whatever",
      productIds: [],
    }).length;
    expect(checklist.length).toBe(baseCount);
  });

  it("returns only base checklist for unknown vertical", () => {
    const checklist = generateChecklist({
      industryId: "saas",
      verticalId: "nonexistent-vertical",
      productIds: ["patient-portal"],
    });
    const baseCount = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: [],
    }).length;
    expect(checklist.length).toBe(baseCount);
  });

  it("base items have plan stage with sortOrder 10-40", () => {
    const checklist = generateChecklist({
      industryId: "x",
      verticalId: "x",
      productIds: [],
    });
    const planItems = checklist.filter((c) => c.stage === "plan");
    expect(planItems.length).toBeGreaterThanOrEqual(4);
    for (const item of planItems) {
      expect(item.sortOrder).toBeGreaterThanOrEqual(10);
      expect(item.sortOrder).toBeLessThanOrEqual(40);
    }
  });

  it("all items have title and description", () => {
    const checklist = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: ["patient-portal", "telemedicine"],
    });
    for (const item of checklist) {
      expect(item.title).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(["plan", "build", "launch", "grow"]).toContain(item.stage);
      expect(typeof item.sortOrder).toBe("number");
    }
  });

  it("product items have sortOrder starting at 140", () => {
    const checklist = generateChecklist({
      industryId: "saas",
      verticalId: "saas-healthcare",
      productIds: ["patient-portal"],
    });
    const productItems = checklist.filter((c) =>
      c.title.includes("Patient Portal")
    );
    expect(productItems[0].sortOrder).toBe(140);
    expect(productItems[1].sortOrder).toBe(141);
    expect(productItems[2].sortOrder).toBe(142);
  });
});
