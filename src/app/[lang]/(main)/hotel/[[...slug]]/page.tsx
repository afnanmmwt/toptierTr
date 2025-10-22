import React from 'react'
import { getDictionary } from '@src/get-dictionary'
// import { Icon } from '@iconify/react'
// import { HomeWrapper } from '@components/themes/default'
import TransitionLayout from '@src/utils/pageTransition'
// import HomeWrapper from '@components/themes/default/components/home/homeWrapper/homeWrapper'
import { HotelDetailsMain ,HotelsListingMain} from '@components/themes/default'
import { hotel_search } from '@src/actions'

export default async function Page({ params }: {
  params: Promise<{ lang: 'en' | 'ar' ,slug: string[]}>
}) {
  const { lang,slug } = await params
//  const modules = searchParams.modules
//     ? searchParams.modules.split(",") // 👈 convert back to array
//     : ["stuba"]; // fallback
// const modules=['hotels','stuba', 'hotelbeds']
//   const payloadBase = {
//     destination: slug[0],
//     checkin: slug[1],
//     checkout: slug[2],
//     rooms: Number(slug[3]),
//     adults: Number(slug[4]),
//     children: Number(slug[5]),
//     nationality: slug[6],
//     page: 1,
//     price_from: "",
//     price_to: "",
//     rating: "",
//   };

  // 🔁 Run API for each module
  // const results = await Promise.all(
  //   modules.map((m) =>
  //     hotel_search({ ...payloadBase, modules: m })
  //   )
  // );

  // ✅ Merge results
  // const hotelData = results.flat();

  // console.log('search hotels data data',hotelData)
  // const isListingPage = isNaN(Number(slug[0])) // true if not a number
  const dict = await getDictionary(lang)
  return (
    <TransitionLayout>
      <div className="flex flex-col bg-white dark:bg-gray-900 dark:text-gray-50">
          <HotelsListingMain  slug={slug}/>
      </div>
    </TransitionLayout>
  )
}

export const dynamic = "force-dynamic"