import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormInput from './FormInput';
import FormToggle from './FormToggle';
import ImageUploadField from './ImageUploadField';
import { X, Loader2 } from 'lucide-react';
import { MapPin, MapPinned } from 'lucide-react';
import LocationMap from '../form/LocationMap';
import { useCreateRestaurantMutation } from '../../redux/features/restaurant/restaurantApi';


const CreateRestaurantForm = () => {
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [createRestaurant, { isLoading }] = useCreateRestaurantMutation();
  
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue,
    watch 
  } = useForm({
    defaultValues: {
      name: '',
      address: '',
      latitude: 30.06263,
      longitude: 31.24967,
      //latitude: 23.777176,
      //longitude: 90.399452,
      features: '',
      bookingFeePerGuest: 0,
      cancellationPercentage: 0,
      discount: ''
    }
  });

  
    // Watch the latitude and longitude values
    const latitude = watch('latitude');
    const longitude = watch('longitude');
  
    // Update map when coordinates change in form
    useEffect(() => {
      if (latitude && longitude) {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          setSelectedLocation([lat, lng]);
        }
      }
    }, [latitude, longitude]);
  
    // Handle location selection from map
    const handleLocationSelect = (location) => {
      setSelectedLocation(location);
      setValue('latitude', location[0].toFixed(6));
      setValue('longitude', location[1].toFixed(6));
    };

  const onSubmit = (data) => {
    
    // Process form data similar to original
    const finalValues = {
      ...data,
      paymentRequired,
      features: data.features ? data.features.split(',').map(s => s.trim()) : []
    };
    
   
    // Create FormData for file upload
    const formData = new FormData();
    Object.keys(finalValues).forEach(key => {
      if (key === 'file' && finalValues[key]) {
        formData.append('file', finalValues[key][0]);
      } else if (['features'].includes(key)) {
        finalValues[key].forEach(item => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, finalValues[key]);
      }
    });
    
    // Simulate API call
   // console.log('Form Data:', Object.fromEntries(formData));
    
    // Simulate API call with timeout
       createRestaurant(formData);

  };





  return (
    <div className="bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6 transition-all">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create a Restaurant
        </h2>
        
        {/* Restaurant Name */}
        <FormInput
          label="Restaurant Name"
          name="name"
          register={register}
          rules={{ required: "Restaurant Name is required" }}
          error={errors.name}
          placeholder="Enter restaurant name"
          required
        />
        
        {/* Image Upload */}
        <ImageUploadField
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
        />
        
       
        {/* Features */}
        <FormInput
          label="Features (comma-separated)"
          name="features"
          register={register}
          rules={{ 
            pattern: {
              //value: /^([\w\s&-]+)(,\s*[\w\s&-]+)*$/,
              value: /^([^,\n]+)(,\s*[^,\n]+)*$/,
              message: "Please enter valid comma-separated features"
            }
          }}
          error={errors.features}
          placeholder="e.g. outdoor seating, private dining"
          required
        />
        
     <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white shadow-md p-6 rounded-md">
      <div className="order-2 lg:order-1">
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <div className="relative">
              <input
                {...register('address', { required: 'Address is required' })}
                id="address"
                type="text"
                className={`
                  w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none
                  ${errors.address ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}
                `}
                placeholder="Enter location address"
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <MapPin size={18} />
              </div>
            </div>
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                {...register('latitude', { 
                  required: 'Latitude is required',
                  pattern: {
                    value: /^-?([0-8]?[0-9]|90)(\.[0-9]{1,6})?$/,
                    message: 'Invalid latitude format'
                  }
                })}
                id="latitude"
                type="text"
                className={`
                  w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none
                  ${errors.latitude ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}
                `}
                placeholder="e.g., 37.7749"
              />
              {errors.latitude && (
                <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                {...register('longitude', { 
                  required: 'Longitude is required',
                  pattern: {
                    value: /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,6})?$/,
                    message: 'Invalid longitude format'
                  }
                })}
                id="longitude"
                type="text"
                className={`
                  w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none
                  ${errors.longitude ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}
                `}
                placeholder="e.g., -122.4194"
              />
              {errors.longitude && (
                <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>
              )}
            </div>
          </div>


        </div>

        {selectedLocation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fadeIn">
            <h3 className="text-sm font-semibold text-blue-700 flex items-center">
              <MapPinned size={16} className="mr-1" /> 
              Selected Location
            </h3>
            <div className="mt-2 text-sm text-blue-800">
              <p>Latitude: {selectedLocation[0].toFixed(6)}</p>
              <p>Longitude: {selectedLocation[1].toFixed(6)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="order-1 lg:order-2 h-[350px] lg:h-[500px]">
        <LocationMap onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />
      </div>
    </div>
        
        {/* Payment & Cancellation Section */}
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <FormToggle
              label="Payment Required"
              enabled={paymentRequired}
              setEnabled={setPaymentRequired}
            />
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <FormInput
              label="Booking Fee Per Guest (Optional)"
              name="bookingFeePerGuest"
              register={register}
              rules={{ 
                min: { 
                  value: paymentRequired ? 1 : 0, 
                  message: paymentRequired ? "Booking Fee must be at least 1" : "Booking Fee cannot be negative" 
                }
              }}
              error={errors.bookingFeePerGuest}
              placeholder="e.g. 5"
              type="number"
              step="any"
              disabled={!paymentRequired}
            />
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <FormInput
              label="Cancellation Charge (%, Optional)"
              name="cancellationPercentage"
              register={register}
              rules={{ 
                min: { value: 0, message: "Cancellation charge cannot be negative" }
              }}
              error={errors.cancellationPercentage}
              placeholder="e.g. 5"
              type="number"
              step="any"
              disabled={!paymentRequired}
            />
          </div>
        </div>
        
        {/* Discount */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block font-semibold text-gray-700">
              Discount (Optional)
            </label>
            <FormToggle
              enabled={discountEnabled}
              setEnabled={setDiscountEnabled}
              small
            />
          </div>
          <div className="mt-1">
            <input
              type="text"
              {...register('discount')}
              disabled={!discountEnabled}
              placeholder="Enter discount"
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-red-300 transition-all ${!discountEnabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-rose-500 text-white py-3 rounded-md flex items-center justify-center gap-3 hover:bg-rose-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating...
            </>
          ) : (
            "Create Restaurant"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateRestaurantForm;