import { useEffect, useState } from "react";
import "./ChildForm.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import Button from "../button/button";
import placeholderChild from "../../assets/placeholderChild.webp";

export default function ChildForm(saveChild, child) {
  const [firstName, setFirstName] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (child) {
      setFirstName(child.firstName);
      setOtherNames(child.otherNames);
      setDob(child.dob);
      setAge(child.age);
      setImage(child.image);
    }
  }, [child]);

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file.size < 500000) {
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

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = {
      // create a new objebt to hold the value from states / input fields
      firstName: firstName,
      otherNames: otherNames,
      dob: dob,
      age: age,
      image: await handleUploadImage(), // call handleUploadImage to upload the image to firebase storage and get the download URL
    };

    console.log(formData);

    const validForm =
      formData.firstName && formData.otherNames && formData.dob && formData.age; // will return false if one of the properties doesn't have a value
    if (validForm) {
      // if all fields/ properties are filled, then call savePost
      saveChild(formData);
    } else {
      // if not, set errorMessage state.
      setErrorMessage("Please, fill in all fields.");
    }
  }

  async function handleUploadImage() {
    const storageRef = ref(storage, imageFile.name); // create a reference to the file in firebase storage
    await uploadBytes(storageRef, imageFile); // upload the image file to firebase storage
    const downloadURL = await getDownloadURL(storageRef); // Get the download URL
    return downloadURL;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="imageInput">
        <img
          src={image}
          alt="Choose an image"
          className="imagePreview"
          onError={(event) => (event.target.src = placeholderChild)}
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
        />
      </label>
      <label>
        Other Names:
        <input
          type="text"
          value={otherNames}
          onChange={(event) => setOtherNames(event.target.value)}
          placeholder="Your child's middle and last names"
        />
      </label>
      <label>
        Date of Birth:
        <input
          type="text"
          value={dob}
          onChange={(event) => setDob(event.target.value)}
          placeholder="Your child's date of birth"
        />
      </label>
      <label>
        Age:
        <input
          type="text"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          placeholder="Your child's age"
        />
      </label>

      <p className="errorMessage">{errorMessage}</p>
      <Button text="Save" type="submit" className="formButton" />
    </form>
  );
}
