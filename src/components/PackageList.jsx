import React, { useState } from 'react';
const MAX_PACKAGE_PRICE = 250;

const PackageList = ({ Items }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [packages, setPackages] = useState([]);

    // Function to toggle item selection and update total price
    const handleCheckboxChange = (item) => {
        setSelectedItems((prevSelectedItems) => {
            const isSelected = prevSelectedItems.includes(item);

            if (isSelected) {
                // Remove item if already selected
                const newSelectedItems = prevSelectedItems.filter(
                    (i) => i !== item
                );
                updateTotalPrice(newSelectedItems);
                updateTotalWeight(newSelectedItems);
                updatePackages(newSelectedItems);
                return newSelectedItems;
            } else {
                // Add item if not already selected
                const newSelectedItems = [...prevSelectedItems, item];
                updateTotalPrice(newSelectedItems);
                updateTotalWeight(newSelectedItems);
                updatePackages(newSelectedItems);
                return newSelectedItems;
            }
        });
    };
    // Function to calculate and update total price and weight
    const updateTotalPrice = (selectedItems) => {
        const sum = selectedItems.reduce(
            (total, item) => total + item.price,
            0
        );
        setTotalPrice(sum);
    };
    const updateTotalWeight = (selectedItems) => {
        const sum = selectedItems.reduce(
            (total, item) => total + item.weight,
            0
        );
        setTotalWeight(sum);
    };

    const updatePackages = (selectedItems) => {
        const packages = divideIntoPackages(selectedItems, MAX_PACKAGE_PRICE);
        setPackages(packages);
    };

    const divideIntoPackages = (items, maxPrice) => {
        let packages = [];

        // Sort items by weight in descending order for even distribution
        items.sort((a, b) => b.weight - a.weight);

        // Function to find a suitable package
        const findSuitablePackage = (item) => {
            for (let i = 0; i < packages.length; i++) {
                if (packages[i].totalPrice + item.price <= maxPrice) {
                    return i;
                }
            }
            return -1;
        };

        items.forEach((item) => {
            let packageIndex = findSuitablePackage(item);

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
            <div className='fit'>
                <table className='tab'>
                    <tbody>
                        <tr>
                            <th>Select</th>
                            <th>Name</th>
                            <th>Price($)</th>
                            <th>Weight(g)</th>
                        </tr>
                        {Items.items.map((item, index) => {
                            const isChecked = selectedItems.includes(item);
                            return (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type='checkbox'
                                            id={index}
                                            checked={isChecked} // Determine whether checkbox is checked
                                            onChange={() =>
                                                handleCheckboxChange(item)
                                            } // Toggle selection
                                        />
                                    </td>
                                    {/* mapped item and given index as id to select anywhere user click in row */}
                                    <td>
                                        <label htmlFor={index}>
                                            {item.name}
                                        </label>
                                    </td>
                                    <td>
                                        <label htmlFor={index}>
                                            {item.price}
                                        </label>
                                    </td>
                                    <td>
                                        <label htmlFor={index}>
                                            {item.weight}
                                        </label>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button id='ins'>Place Order</button>
            </div>

            {/* The selectedItems array is used to render the selected items in a list.
If no items are selected, a message saying "No items selected" is displayed. */}
            <div>
                <h1 style={{ color: 'green' }}>Selected Items:</h1>
                {packages.length > 0 ? (
                    packages.map((pkg, pkgIndex) => (
                        <div key={pkgIndex} className='fit'>
                            <h3 style={{ color: 'blue' }}>
                                Package {pkgIndex + 1}:
                            </h3>
                            <ul>
                                {pkg.items.map((item, index) => (
                                    <li
                                        style={{ color: 'green' }}
                                        key={index}
                                    >{`${item.name} - ${item.price}$ - ${item.weight}g`}</li>
                                ))}
                            </ul>
                            <strong style={{ color: 'blue' }}>
                                Total Price: ${pkg.totalPrice}
                            </strong>
                        </div>
                    ))
                ) : (
                    <p style={{ color: 'red' }}>No items selected</p>
                )}
                <h3 style={{ color: 'purple' }}>
                    Total Price: {totalPrice}$ <br /> Total Weight:{' '}
                    {totalWeight}g
                </h3>
            </div>
        </>
    );
};

export default PackageList;
