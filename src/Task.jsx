import React from "react";
const Task = ({ Items }) => {
  return (
    <>
      <div className="fit">
        <table className="tab">
          <tbody>
            <tr>
              <th>Select</th>
              <th>Items</th>
              <th>Price</th>
              <th>Weight</th>
            </tr>

            {Items.items.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <input type="checkbox" id={index} />
                  </td>
                  <td><label htmlFor={index}>{item.name}</label></td>
                  <td><label htmlFor={index}>{item.price}</label></td>
                  <td><label htmlFor={index}>{item.weight}</label></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button id="ins">Place Order</button>
    </>
  );
};

export default Task;
