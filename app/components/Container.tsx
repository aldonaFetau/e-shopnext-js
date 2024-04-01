
interface ContainerProps{
    children: React.ReactNode
}
// mx-auto -puts container in the center
// define reponsivness for large medium and small screens with xl:px-20 (set padding 20 to boshti x)
const Container :React.FC<ContainerProps> = ({children}) => {
    return ( <div
    className="max-w-[1920px] mx-auto xl:px-5 md:px-2 px-4">{children}</div> );
}
 
export default Container;