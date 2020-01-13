const createAutoComplete = ({ root, renderItem, onItemSelect, fetchData }) => {
  root.innerHTML = `
    <input placeholder="search" />
    <div id="drop"></div>
    ${root.innerHTML}
`;

  const input = root.querySelector("input");
  const dropDown = root.querySelector("#drop");

  const renderSearch = items => {
    dropDown.style.display = "block";
    for (let item of items) {
      const dropItem = document.createElement("div");
      dropItem.setAttribute("class", "drop-item");

      dropItem.innerHTML = renderItem(item);
      const text = dropItem.querySelector(".drop-text");

      let prevValue = "";
      dropItem.addEventListener("mouseover", () => {
        prevValue = input.value;
        input.value = text.innerText;
      });
      dropItem.addEventListener("mouseout", () => {
        input.value = prevValue;
      });
      dropItem.addEventListener("click", () => {
        dropDown.style.display = "none";
        prevValue = "";
        onItemSelect(item);
      });
      dropDown.appendChild(dropItem);
    }
  };

  const onInput = async ({ target }) => {
    dropDown.innerHTML = "";
    const { value } = target;
    if (value.length > 0) {
      const response = await fetchData(value);
      if (response) renderSearch(response);
    } else {
      dropDown.style.display = "none";
    }
  };

  input.addEventListener("input", debounce(onInput, 500));
  document.addEventListener("click", ({ target }) => {
    if (target.nodeName === "INPUT") {
      if (target.value.length === 0) {
        dropDown.style.display = "none";
      } else {
        dropDown.style.display = "block";
      }
    } else {
      dropDown.style.display = "none";
    }
  });
};
