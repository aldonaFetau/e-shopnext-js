import prisma from "@/libs/prismadb";
import moment from 'moment';

export default async function getGraphData() {
    try {
        //get the start and end dates for the date range of 7 days from today
        const startDate = moment().subtract(6, "days").startOf("day");
        const endDate = moment().endOf("day");

        //query the db to get the order data grouped by createdDate

        const result = await prisma.order.groupBy({

            by:["createDate"],
            where:{
                createDate:{
                    gte:startDate.toISOString(),
                    lte:endDate.toISOString()
                },
                status:"complete"
            },
            _sum: {
                amount: true
            }
        });


        //Initalize an object to get the data by day
        const aggregatedData :{
            [day:string]:{
                day:string; date:string; totalAmount: number
            };
        }={};
        
        //create a clone of startdate to iterate over each day
        const currentDate = startDate.clone();

        //Iterate over each day in the date range

        while(currentDate <= endDate){
             //Format the day as a string (e.g "Monday")
             const day = currentDate.format("dddd");
             console.log("day<<<<<<", day, currentDate);

             //Initialize the aggregated data for the day, with the day, date, and total amount
             aggregatedData[day] = {
                day,
                date:currentDate.format("YYYY-MM-DD"),
                totalAmount:0
             }
        currentDate.add(1,"day");

        }

     //Calculate the total amount for each day by summing in the order amounts

     result.forEach((entry)=>{
      const day = moment(entry.createDate).format("dddd");
      const amount = entry._sum.amount || 0;
      aggregatedData[day].totalAmount += amount;
     
      })
      //Convert the aggregated object to an array and sort it by date
      const formattedData = Object.values(aggregatedData).sort((a, b) =>

        moment(a.date).diff(moment(b.date))
      );
     
      return formattedData;   

    } catch (error:any) {
        throw new Error(error)
    }
}