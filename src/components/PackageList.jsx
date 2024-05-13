import React, { useState } from "react";
const MAX_PACKAGE_PRICE = 250;

const PackageList = ({ Items }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [packages, setPackages] = useState([]);
  const [charge, setCharge] = useState(0);
  const [totalCharge, setTotalCharge] = useState(0);

  // Function to toggle item selection and update total price
  const handleCheckboxChange = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.includes(item);

      const newSelectedItems = isSelected
        ? // Remove item if already selected, Add item if not already selected
          prevSelectedItems.filter((i) => i !== item)
        : [...prevSelectedItems, item];

      updateSelections(newSelectedItems);
      return newSelectedItems;
    });
  };
  // Function to calculate and update total price and weight
  const updateSelections = (selectedItems) => {
    const totalPrice = selectedItems.reduce(
      (total, item) => total + item.price,
      0
    );
    const totalWeight = selectedItems.reduce(
      (total, item) => total + item.weight,
      0
    );

    const packages = divideIntoPackages(selectedItems);

    setTotalPrice(totalPrice);
    setTotalWeight(totalWeight);
    setPackages(packages);

    if (totalWeight > 0 && totalWeight < 200) {
      setCharge(5);
    } else if (totalWeight >= 200 && totalWeight < 500) {
      setCharge(10);
    } else if (totalWeight >= 500 && totalWeight < 1000) {
      setCharge(15);
    } else if (totalWeight >= 1000 && totalWeight < 5000) {
      setCharge(20);
    } else {
      setCharge(0);
    }
  };

  const divideIntoPackages = (items) => {
    let packages = [];
    // Function to find a suitable package
    items.forEach((item) => {
      let packageIndex = packages.findIndex(
        (p) => p.totalPrice + item.price <= MAX_PACKAGE_PRICE
      );
      if (packageIndex === -1) {
        // No suitable package found, create a new one
        packages.push({
          items: [item],
          totalPrice: item.price,
          totalWeight: item.weight,
        });
      } else {
        // Add item to the suitable package
        packages[packageIndex].items.push(item);
        packages[packageIndex].totalPrice += item.price;
        packages[packageIndex].totalWeight += item.weight;
      }
    });
    return packages;
  };
  return (
    <>
      <div className="fit">
        <table className="tab">
          <tbody>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Price($)</th>
              <th>Weight(g)</th>
            </tr>
            {Items.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    id={index}
                    checked={selectedItems.includes(item)} // Determine whether checkbox is checked
                    onChange={() => handleCheckboxChange(item)} // Toggle selection
                  />
                </td>
                {/* mapped item and given index as id to select anywhere user click in row */}
                <td>
                  <label htmlFor={index}>{item.name}</label>
                </td>
                <td>
                  <label htmlFor={index}>{item.price}</label>
                </td>
                <td>
                  <label htmlFor={index}>{item.weight}</label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button id="ins">Place Order</button>
      </div>
      <div>
        <h1 style={{ color: "green" }}>Selected Items:</h1>
        {packages.length > 0 ? (
          packages.map((pkg, pkgIndex) => (
            <div key={pkgIndex} className="fit">
              <h3 style={{ color: "blue" }}>Package {pkgIndex + 1}:</h3>
              <ul>
                {pkg.items.map((item, index) => (
                  <li
                    style={{ color: "green" }}
                    key={index}
                  >{`${item.name} - ${item.price}$ - ${item.weight}g`}</li>
                ))}
              </ul>
              <strong style={{ color: "blue" }}>
                Price: ${pkg.totalPrice}
                <p> Weight: {pkg.totalWeight}g</p>
                <p> Charge: {charge}$</p>
              </strong>
            </div>
          ))
        ) : (
          <p style={{ color: "red" }}>No items selected</p>
        )}
        <h3 style={{ color: "purple" }}>
          Total Price: {totalPrice}$ <br /> Total Weight: {totalWeight}g <br />
          Total Charge: {totalCharge}$
        </h3>
      </div>
    </>
  );
};

export default PackageList;
