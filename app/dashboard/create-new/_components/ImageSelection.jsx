import Image from 'next/image';
import React, { useState } from 'react';

function ImageSelection({ selectedImage }) {
  const [file, setFile] = useState();

  const onFileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);

    // Convert the selected file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      selectedImage(reader.result); // Send the base64 string to parent component
    };
  };

  return (
    <div>
      <label>Select Image of Your Room</label>
      <div className='mt-3'>
        <label htmlFor="upload-image">
          <div className={`p-28 border rounded-xl border-dotted flex bg-slate-200 justify-center border-primary cursor-pointer hover:shadow-md ${file && 'p-3 bg-white'}`}>
            {!file ? (
              <Image src={'/imageupload.png'} height={100} width={100} alt='ai' className='object-cover' />
            ) : (
              <Image src={URL.createObjectURL(file)} height={300} width={300} alt='ai' className='object-cover w-[300px] h-[300px]' />
            )}
          </div>
        </label>
        <input 
          type="file" accept='image/*' id='upload-image' 
          style={{ display: 'none' }}
          onChange={onFileSelected}
        />
      </div>
    </div>
  );
}

export default ImageSelection;
