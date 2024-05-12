import React from "react";

const ChargeTable = ({ CTable }) => {
  return (
    <>
      <div className="right">
        <table className="tab">
          <tbody>
            <tr>
              <th colSpan={2}>Courier Charges</th>
            </tr>
            <tr>
              <th>Weight(g)</th>
              <th>Price($)</th>
            </tr>

            {CTable.courierCharges.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.weightRange}</td>
                  <td>{item.charge}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ChargeTable;
