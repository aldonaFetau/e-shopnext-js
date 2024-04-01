
export const revalidate = 0;
import Container from "./components/Container";
import HomeBanner from "./components/HomeBanner";
import ProductCard from "./components/products/ProductCard";
import getProducts, { IProductParams } from "@/actions/getProducts";
import NullData from "./components/NullData";

interface HomeProps{
  searchParams: IProductParams
}

export default async function Home({searchParams}:HomeProps) {
  console.log("product filter", searchParams)
const products = await getProducts(searchParams);
console.log("produktet 2", products)
if(products.length===0){
  return <NullData title= "No products found. Click 'All' to clear filters"/>
}
//Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i (inclusive)
      const j = Math.floor(Math.random() * (i + 1));

      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
const shuffledProducts = shuffleArray(products)
  return (
    <div className="p-8">
      <Container>
        <div>
          <HomeBanner/>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {shuffledProducts.map((product :any)=>{
            return <ProductCard data={product} key={product.id}/>
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
