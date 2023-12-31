import { useEffect, useState } from "react";
import "./childForm.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import placeholderChild from "../../assets/placeholderChild.webp";

// Defining the ChildForm functional component, which takes 'saveChild' and 'child' as props
export default function ChildForm({ saveChild, child }) {
  // State variables for form input values and error message
  const [firstName, setFirstName] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect to update form input values when 'child' prop changes
  useEffect(() => {
    if (child) {
      setFirstName(child.firstName || "");
      setOtherNames(child.otherNames || "");
      setDob(child.dob || "");
      setAge(child.age || "");
      setImage(child.image || placeholderChild);
    }
  }, [child]);

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
      firstName: firstName,
      otherNames: otherNames,
      dob: dob,
      age: age,
      image: image, // keep the existing image URL if the user doesn't upload a new image
    };

    // If a new image file is selected, upload it to Firebase Storage and get the download URL
    if (imageFile) {
      formData.image = await handleUploadImage(); // call handleUploadImage to upload the image to firebase storage and get the download URL
    }

    console.log(formData);

    // Check if all required fields are filled before calling saveChild
    const validForm =
      formData.firstName &&
      formData.otherNames &&
      formData.dob &&
      formData.age &&
      formData.image;
    if (validForm) {
      // if all fields/ properties are filled, then call saveChild
      saveChild(formData);
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

    const storageRef = ref(storage, imageFile.name); // create a reference to the file in firebase storage
    await uploadBytes(storageRef, imageFile); // upload the image file to firebase storage
    const downloadURL = await getDownloadURL(storageRef); // Get the download URL
    return downloadURL;
  }

  return (
    <form onSubmit={handleSubmit} className="childForm">
      <label className="imageInput">
        <img
          src={image}
          alt="Choose an image"
          className="imagePreview"
          onError={(event) => (event.target.src = placeholderChild)}
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
        First Name:
        <input
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="Your child's first name"
          name="firstName"
        />
      </label>
      <label className="formFlex">
        <p>Other Names:</p>
        <input
          type="text"
          value={otherNames}
          onChange={(event) => setOtherNames(event.target.value)}
          placeholder="Middle and last names"
          name="otherNames"
        />
      </label>
      <label className="formFlex">
        <p>Date of Birth:</p>
        <input
          type="text"
          value={dob}
          onChange={(event) => setDob(event.target.value)}
          placeholder="Your child's date of birth"
          name="dob"
        />
      </label>
      <label>
        Age:
        <input
          type="text"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          placeholder="Your child's age"
          name="age"
        />
      </label>

      <p className="errorMessage">{errorMessage}</p>
      <button className="formButton" type="submit">
        Save
      </button>
    </form>
  );
}
