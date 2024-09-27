import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { getMessageUids } from "$lib/server/imap"
import type { Config } from "node-imap"
import { StatusCodes } from "http-status-codes"
import { parseHeaders } from "$lib/tools"


// Get Message uids
export const GET: RequestHandler = async ({request, params}) => {
    const {headers} = request
    const mailboxName = params.mailboxName

    // Parse headers
    const {
        data: imapConfig,
        error: parseError
    } = parseHeaders(headers)
    if (parseError) {
        console.log(parseError.message)
        return json({
            success: false,
            error: true,
            error_code: StatusCodes.BAD_REQUEST,
            error_message: parseError.message
        })
    }

    // Get message uids
    try {
        const uids: number[] = await getMessageUids(imapConfig as Config, mailboxName)
        return json({
            success: true,
            uids,
            total: uids.length
        })
    } catch (error: any) {
        return json({
            success: false,
            error: true,
            error_code: StatusCodes.INTERNAL_SERVER_ERROR,
            error_message: error.toString()
        })
    }

}
