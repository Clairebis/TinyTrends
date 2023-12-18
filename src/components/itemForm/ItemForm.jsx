import { useEffect, useState } from "react";
import "../../components/itemForm/itemForm.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import placeholderItem from "../../assets/placeholderItem.webp";
import SizeDropdown from "../dropdowns/SizeDropdown";
import CategoryDropdown from "../dropdowns/CategoryDropdown";

// Defining the ItemForm functional component, which takes 'saveItem' and 'item' as props
export default function ItemForm({ saveItem, item }) {
  // State variables for form input values, image, and error message
  const [caption, setCaption] = useState("");
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState(""); // create an empty status field for the user to later add sell / donate / recycle
  const [selected, setSelected] = useState(""); // create an empty selected field for the user to later select the item to mark as sold / donated / recycled
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect to update form input values when 'item' prop changes
  useEffect(() => {
    if (item) {
      setCaption(item.caption || "");
      setBrand(item.brand || "");
      setSize(item.size || "");
      setCategory(item.category || "");
      setImage(item.image || placeholderItem);
      setStatus(item.status || "");
      setSelected(item.selected || "");
    }
  }, [item]);

  // Function to handle changes in the selected image file
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file.size < 3000000) {
      // image file size must be below 0,5MB
      setImageFile(file); // set the imageFile state with the file object
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
      setErrorMessage(""); // reset errorMessage state
    } else {
      // if not below 0.5MB display an error message using the errorMessage state
      setErrorMessage("The image file is too big!");
    }
  }

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = {
      // create a new objebt to hold the value from states / input fields
      caption: caption,
      brand: brand,
      size: size,
      category: category,
      image: image, // keep the existing image URL if the user doesn't upload a new image
      status: status,
      selected: selected,
    };

    // If a new image file is selected, upload it to Firebase Storage and get the download URL
    if (imageFile) {
      formData.image = await handleUploadImage(); // call handleUploadImage to upload the image to firebase storage and get the download URL
    }

    console.log(formData);

    // Check if all required fields are filled before calling saveItem function
    const validForm =
      formData.caption &&
      formData.brand &&
      formData.size &&
      formData.category &&
      formData.image; // will return false if one of the properties doesn't have a value
    if (validForm) {
      // if all fields/ properties are filled, then call saveItem function and pass the formData object as an argument
      saveItem(formData);
    } else {
      // if not, set errorMessage state.
      setErrorMessage("Please, fill in all fields.");
    }
  }

  // Function to handle the upload of the selected image file to Firebase Storage
  async function handleUploadImage() {
    if (!imageFile) {
      // Handle the case where imageFile is not defined
      return "";
    }

    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, imageFile.name); // create a reference to the file in firebase storage
    await uploadBytes(storageRef, imageFile); // upload the image file to firebase storage
    const downloadURL = await getDownloadURL(storageRef); // Get the download URL
    return downloadURL;
  }

  // Callback functions to update the state
  const handleSizeChange = (selectedSize) => {
    setSize(selectedSize);
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  return (
    <form onSubmit={handleSubmit} className="itemForm">
      <label className="imageInput">
        <img
          src={image}
          alt="Choose an image"
          className="formImagePreview"
          onError={(event) => (event.target.src = placeholderItem)}
          name="image"
        />

        <input
          type="file"
          className="fileInput"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
      <label>
        Item:
        <input
          type="text"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="What item are you adding?"
          name="item"
        />
      </label>
      <label>
        Brand:
        <input
          type="text"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          placeholder="E.g. Zara"
          name="brand"
        />
      </label>
      <SizeDropdown onSizeChange={handleSizeChange} />
      <CategoryDropdown onCategoryChange={handleCategoryChange} />

      <p className="errorMessage">{errorMessage}</p>
      <button className="formButton" type="submit">
        Save
      </button>
    </form>
  );
}
