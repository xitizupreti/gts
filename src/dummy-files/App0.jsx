import React, { useState } from 'react';

const items = [
    { id: 1, name: 'Item 1', price: 10, weight: 100 },
    { id: 2, name: 'Item 2', price: 15, weight: 300 },
    { id: 3, name: 'Item 3', price: 20, weight: 500 },
    { id: 4, name: 'Item 4', price: 25, weight: 700 },
    { id: 5, name: 'Item 5', price: 40, weight: 900 },
    { id: 6, name: 'Item 6', price: 60, weight: 1200 },
    { id: 7, name: 'Item 7', price: 100, weight: 2500 },
    { id: 8, name: 'Item 8', price: 200, weight: 4000 },
];

const weightCharges = [
    { range: '0-200g', minWeight: 0, maxWeight: 200, charge: 5 },
    { range: '200-500g', minWeight: 200, maxWeight: 500, charge: 10 },
    { range: '500-1000g', minWeight: 500, maxWeight: 1000, charge: 15 },
    { range: '1000-5000g', minWeight: 1000, maxWeight: 5000, charge: 20 },
];

const MAX_PACKAGE_PRICE = 250;

function TableWithCheckboxes() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [packages, setPackages] = useState([]);

    const handleCheckboxChange = (item) => {
        setSelectedItems((prevSelectedItems) => {
            const isSelected = prevSelectedItems.includes(item);

            if (isSelected) {
                const newSelectedItems = prevSelectedItems.filter(
                    (i) => i !== item
                );
                updatePackages(newSelectedItems);
                return newSelectedItems;
            } else {
                const newSelectedItems = [...prevSelectedItems, item];
                updatePackages(newSelectedItems);
                return newSelectedItems;
            }
        });
    };

    const updatePackages = (selectedItems) => {
        const packages = divideIntoPackages(selectedItems, MAX_PACKAGE_PRICE);
        setPackages(packages);
    };

    const divideIntoPackages = (items, maxPrice) => {
        items.sort((a, b) => b.weight - a.weight); // Sort items by weight (descending)

        let packages = [];
        let currentPackage = [];
        let currentTotalPrice = 0;
        let currentTotalWeight = 0;

        items.forEach((item) => {
            if (currentTotalPrice + item.price > maxPrice) {
                packages.push(currentPackage);
                currentPackage = [item];
                currentTotalPrice = item.price;
                currentTotalWeight = item.weight;
            } else {
                currentPackage.push(item);
                currentTotalPrice += item.price;
                currentTotalWeight += item.weight;
            }
        });

        if (currentPackage.length > 0) {
            packages.push(currentPackage);
        }

        // Balance weights across packages
        const balancedPackages = balancePackageWeights(packages);

        // Calculate shipping costs
        return balancedPackages.map((pkg) => ({
            package: pkg,
            shippingCost: calculateShippingCost(pkg),
        }));
    };

    const balancePackageWeights = (packages) => {
        // Calculate the total weight of all packages
        const totalWeight = packages.reduce((sum, pkg) => {
            return sum + pkg.reduce((pkgSum, item) => pkgSum + item.weight, 0);
        }, 0);

        const averageWeight = totalWeight / packages.length;

        // Adjust packages to balance weights
        let balancedPackages = packages.map((pkg) => {
            const totalWeight = pkg.reduce((sum, item) => sum + item.weight, 0);
            return { package: pkg, totalWeight };
        });

        balancedPackages.sort((a, b) => b.totalWeight - a.totalWeight);

        // Perform weight balancing
        for (let i = 0; i < balancedPackages.length; i++) {
            const currentPackage = balancedPackages[i];
            while (
                currentPackage.totalWeight > averageWeight &&
                i + 1 < balancedPackages.length
            ) {
                const nextPackage = balancedPackages[i + 1];
                for (let j = 0; j < currentPackage.package.length; j++) {
                    const item = currentPackage.package[j];
                    if (
                        currentPackage.totalWeight - item.weight >=
                            averageWeight &&
                        nextPackage.totalWeight + item.weight <= averageWeight
                    ) {
                        currentPackage.package.splice(j, 1);
                        currentPackage.totalWeight -= item.weight;
                        nextPackage.package.push(item);
                        nextPackage.totalWeight += item.weight;
                        j--; // Adjust index after removal
                    }
                }
            }
        }

        return balancedPackages.map((pkg) => pkg.package);
    };

    const calculateShippingCost = (pkg) => {
        const totalWeight = pkg.reduce((total, item) => total + item.weight, 0);
        for (const charge of weightCharges) {
            if (
                totalWeight >= charge.minWeight &&
                totalWeight <= charge.maxWeight
            ) {
                return charge.charge;
            }
        }
        return 0;
    };

    return (
        <div>
            <table
                border='1'
                style={{ width: '100%', borderCollapse: 'collapse' }}
            >
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        const checkboxId = `checkbox-${index}`;
                        const isChecked = selectedItems.includes(item);
                        return (
                            <tr key={index}>
                                <td>
                                    <input
                                        type='checkbox'
                                        id={checkboxId}
                                        checked={isChecked}
                                        onChange={() =>
                                            handleCheckboxChange(item)
                                        }
                                    />
                                </td>
                                <td>
                                    <label htmlFor={checkboxId}>
                                        {item.name}
                                    </label>
                                </td>
                                <td>
                                    <label
                                        htmlFor={checkboxId}
                                    >{`$${item.price}`}</label>
                                </td>
                                <td>
                                    <label
                                        htmlFor={checkboxId}
                                    >{`${item.weight}g`}</label>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div style={{ marginTop: '20px' }}>
                <h2>Selected Items and Packages:</h2>
                {packages.length > 0 ? (
                    packages.map((pkg, pkgIndex) => (
                        <div key={pkgIndex} style={{ marginBottom: '10px' }}>
                            <h3>Package {pkgIndex + 1}:</h3>
                            <ul>
                                {pkg.package.map((item, index) => (
                                    <li
                                        key={index}
                                    >{`${item.name} - $${item.price} - ${item.weight}g`}</li>
                                ))}
                            </ul>
                            <strong>
                                Total Price: $
                                {pkg.package.reduce(
                                    (total, item) => total + item.price,
                                    0
                                )}{' '}
                                - Total Weight:
                                {pkg.package.reduce(
                                    (total, item) => total + item.weight,
                                    0
                                )}
                                g - Shipping Cost: ${pkg.shippingCost}
                            </strong>
                        </div>
                    ))
                ) : (
                    <p>No items selected</p>
                )}
            </div>
        </div>
    );
}

export default TableWithCheckboxes;
