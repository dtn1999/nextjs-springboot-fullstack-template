import Autocomplete from "react-google-autocomplete";

export function LocationPicker() {
  return (
    <div className="">
      <Autocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        className="block w-full rounded-full border-neutral-200 bg-white py-4 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-200 focus:ring-opacity-50 focus-visible:ring-0 focus-visible:ring-transparent"
        options={{
          types: ["address"],
        }}
        onPlaceSelected={(place) => {
          console.log(place);
        }}
      />
    </div>
  );
}
