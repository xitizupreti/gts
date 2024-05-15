import React, { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_PACKAGE_PRICE = 250;

const PackageList = ({ Items }) => {
  const notify = () => {
    if (totalCharge > 0 && totalPrice > 0) {
      toast("SuccessFully Ordered!😊");
    } else {
      toast("Please Select Items!💔");
    }
  };
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [packages, setPackages] = useState([]);
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
  };

  const calculateCharge = (totalWeight) => {
    if (totalWeight > 0 && totalWeight < 200) {
      return 5;
    } else if (totalWeight >= 200 && totalWeight < 500) {
      return 10;
    } else if (totalWeight >= 500 && totalWeight < 1000) {
      return 15;
    } else if (totalWeight >= 1000 && totalWeight < 5000) {
      return 20;
    } else {
      return 0;
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
          totalCharge: calculateCharge(item.weight),
        });
      } else {
        // Add item to the suitable package
        packages[packageIndex].items.push(item);
        packages[packageIndex].totalPrice += item.price;
        packages[packageIndex].totalWeight += item.weight;
        packages[packageIndex].totalCharge = calculateCharge(
          packages[packageIndex].totalWeight
        );
      }
    });
    setTotalCharge(packages.reduce((total, pkg) => total + pkg.totalCharge, 0));
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
        <button onClick={notify} id="ins">
          Place Order
        </button>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
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
                <p> Charge: {pkg.totalCharge}$</p>
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
