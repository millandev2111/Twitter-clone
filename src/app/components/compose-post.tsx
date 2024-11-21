import { Avatar } from "@nextui-org/react"
import { createClient } from "../utils/supabase/server"
import { revalidatePath } from "next/cache"

export function ComposePost ({
    userAvatarUrl,

}: {
    userAvatarUrl: string
}) {
    const addPost = async (formData: FormData) => {
        'use server'
        
        const content = formData.get('content')
        if (typeof content !== 'string' || content === null) return;

        if(content === null) return

        const supabase = await createClient()
        //revisar si el usuario esta autenticado
        const {data: {user}} = await supabase.auth.getUser()
        if (user === null) return
        await supabase.from('post').insert({content, user_id: user.id})

        revalidatePath('/')

    }
    return ( 
        <form action={addPost} className="flex flex-row p-3 border-b border-white/20">
            <Avatar className="object-contain mr-4" radius="full" size="md" src={userAvatarUrl} />
            <div className="flex flex-1 flex-col gap-y-4">
            <textarea name="content" rows={4} className="w-full text-2xl bg-black placeholder-gray-500 p-2" placeholder="¡¿Que esta pasando?!" id=""></textarea>
            <button type="submit" className="bg-sky-500 font-bold text-sm rounded-full px-5 py-2 self-end">Postear</button>
            </div>
        </form>
    )
}