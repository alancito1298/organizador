import {SquarePen,ThumbsUp,ThumbsDown,CircleX}
 from "lucide-react";

export default function Referencias() {

return(<section className="flex flex-row bg-violet-100 p-5 mt-5 mx-1 rounded-xl">
<div className="flex flex-row items-center justify-around w-full ">
<div className="flex flex-rows items-center justify-center gap-2"><ThumbsUp className="text-red-600"></ThumbsUp><p className="text-violet-900 font-bold">Mal concepto</p></div>
<div className="flex flex-rows items-center justify-center gap-2"><ThumbsDown className="text-green-600"></ThumbsDown><p className="text-violet-900 font-bold">Buen concepto</p></div>
<div className="flex flex-rows items-center justify-center gap-2"><CircleX className="text-gray-500"></CircleX><p className="text-violet-900 font-bold">Ausente</p></div>
</div>

</section>)
}