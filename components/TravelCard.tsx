import { formatDate } from '@/lib/utils'
import { EyeIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const TravelCard = ({ post }:{ post: TravelTypeCard }) => {
  return (
    <li className='travel-card group'>
        <div className='flex-between'>
            <p className='travel-card_date !text-black-200'>
                {formatDate(post._createdAt)}
            </p>
            <div className='flex gap-1.5'>
                <EyeIcon className='size-6 text-primary'/>
                <span className='text-black-200'>{post.views}</span>

            </div>
        </div>
        <div className='flex-between mt-5 gap-5'>
            <div className='flex-1'>
            <Link href={`/user/${post.author?.id}`}>
            <p className='text-16-medium line-clamp-1'>{post.author?.name}</p>
            </Link>
            <Link href={`/travel/${post._id}`}>
            <h3 className='text-26-semibold line-clamp-1'>{post.title}</h3>
            </Link>
            </div>
            <Link href={`/user/${post.author?.id}`}>
            <Image src='https://placehold.co/48x48' alt='placeholder' width={48} height={48} className='rounded-full'></Image>
            </Link>
        </div>
        <Link href={`/travel/${post?.id}`}>
        <p className='travel-card_desc'>{post.description}</p>
        </Link>
        <img src={post.image} alt='placeholder' className='travel-card_img'></img>
    </li>
  )
}

export default TravelCard