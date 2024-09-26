export default function useUnsplashImage() {

  const getImage = async (keyword: string) => {
    try {
      const img = await fetch(
        `https://api.unsplash.com/search/photos?query=${String(keyword).replace(
          ' ',
          '%20'
        )}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&order_by=downloads`
      );
      return img.json();

    } catch (error) {
      console.log(error);
    }
  };

  return {
    getImage
  };
};