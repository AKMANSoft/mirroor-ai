import EmailNotVerified from "@/components/email-not-verified";
import Layout from "@/components/layout";
import useRecorder from "@/components/use-recorder";
import api from "@/lib/api";
import { handleTranslation } from "@/lib/i18n";
import { formatMinutes, formatSeconds } from "@/lib/utils";
import useAuthUserStore from "@/lib/zustand/authUserStore";
import { ProcessAudioResponse } from "@/types/response.types";
import axios from "axios";
import { useEffect, useState } from "react";



const circumference = 2 * 22 / 7 * 120;

type PageState = {
  state: "PROCESSING_AUDIO" | "RECORDING_AUDIO" | "IDLE" | "RECORDED_AUDIO_IDLE"
  apiResponse?: ProcessAudioResponse,
}

export default function HomePage() {
  const { trans } = handleTranslation()
  const { authUser } = useAuthUserStore()
  const [{ state, apiResponse }, setPageState] = useState<PageState>({ state: "IDLE" })
  const { recorderState, ...handlers } = useRecorder();
  const { audio, recordingMinutes, recordingSeconds } = recorderState;
  const isRecording = state === "RECORDING_AUDIO";
  const [micAvailable, setMicAvailable] = useState(true);



  useEffect(() => {
    if (!authUser || !authUser.email_verified) return;
    const checkMicAvailable = () => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setMicAvailable(true)
        }).catch(() => {
          setMicAvailable(false)
          discardAudio()
        })
    }
    navigator.mediaDevices.addEventListener("devicechange", () => {
      setTimeout(checkMicAvailable, 30)
    })
    checkMicAvailable()
  }, [authUser])


  const handleProcessAudio = async () => {
    if (!audio) return;
    setPageState(prev => ({ ...prev, state: "PROCESSING_AUDIO" }))
    try {
      const { data: audioBlob } = await axios.get<Blob>(audio, { responseType: "blob" })
      const res = await api.processAudio(audioBlob)
      setPageState(({ apiResponse: res, state: "IDLE" }))
    } catch (error) {
      setPageState(({ apiResponse: { succeed: false }, state: "IDLE" }))
    }
    handlers.cancelRecording()
  }

  const toggleRecording = async () => {
    if (isRecording) {
      // if (recordingSeconds >= MINIMUM_SECONDS) {
      handlers.saveRecording()
      setPageState(prev => ({ ...prev, state: "RECORDED_AUDIO_IDLE" }))
      // } else {
      //   handlers.cancelRecording()
      //   setPageState(prev => ({ ...prev, state: "IDLE" }))
      // }
    } else {
      await handlers.startRecording()
      setPageState({ apiResponse: undefined, state: "RECORDING_AUDIO" })
    }
  }

  const discardAudio = () => {
    handlers.cancelRecording();
    setPageState(prev => ({ ...prev, state: "IDLE" }))
  }


  return (
    <Layout>
      {
        authUser &&
        (
          !authUser.email_verified ?
            <EmailNotVerified email={authUser.email} />
            :
            <>
              <div className="bg-secondary px-4 md:px-10 pt-20">
                <div className="flex flex-col gap-32 lg:gap-2 lg:flex-row lg:justify-between w-full h-full min-h-[700px] lg:text-start py-40 text-center lg:py-32 max-w-screen-xl mx-auto">
                  <div className="lg:w-1/2 transition-all duration-500 z-[3] pt-0 lg:pt-32">
                    <h1 className="text-3xl md:text-4xl text-primary font-bold w-full lg:max-w-lg">
                      {trans("home_section_left_text")}
                    </h1>
                  </div>
                  <div className="lg:w-1/2 lg:max-w-[450px] transition-all flex flex-col justify-center items-center duration-500 border-0 border-gray-200 z-[3]">
                    {
                      state === "PROCESSING_AUDIO" ?
                        <div id="audioProcessingSpinner" className="h-full w-full flex flex-col gap-5 items-center justify-center">
                          <div role="status" className="relative">
                            <svg aria-hidden="true"
                              className="w-32 h-32 text-gray-200 animate-spin dark:text-gray-200 fill-primary"
                              viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                            </svg>
                          </div>
                          <p className="text-lg text-gray-500 text-center">
                            {trans("audio_processing_1")}
                          </p>
                        </div>
                        :
                        <>
                          {
                            state === "IDLE" || state === "RECORDING_AUDIO" ?
                              <div className={"flex flex-col w-full gap-3 mt-3 lg:mt-0 items-center justify-center relative " + (isRecording ? "" : "my-10")}>
                                <button type="button" onClick={toggleRecording} disabled={!micAvailable} className="btn-mic absolute inset-auto disabled:opacity-80 disabled:!shadow-none">
                                  <i className={"bi bi-mic text-3xl"}></i>
                                </button>
                                <div className={"ripple w-96 max-w-[380px] -z-[1] " + (isRecording ? "h-96" : "!max-h-0 opacity-0")}>
                                  <div className="circle"></div>
                                  <div className="circle"></div>
                                  <div className="circle"></div>
                                  <div className="circle"></div>
                                </div>
                              </div>
                              :
                              <div className="h-full flex flex-col gap-5 mt-20 lg:mt-0 items-center justify-center">
                                {
                                  audio &&
                                  <audio src={audio} preload="metadata" controls></audio>
                                }
                                <div className="flex flex-wrap gap-2 mt-3 lg:mt-0 justify-center items-center">
                                  <button type="button" onClick={discardAudio}
                                    className="bg-red-600 hover:bg-red-600/80 text-white px-5 py-2 rounded-full">
                                    {trans("discard_audio")}
                                  </button>
                                  <button type="button" onClick={handleProcessAudio}
                                    className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-full transition-all">
                                    {trans("process_audio")}
                                  </button>
                                </div>
                              </div>
                          }
                          {
                            isRecording &&
                            <div className="flex w-full max-w-[380px] justify-center">
                              <p className="text-3xl font-bold text-primary">
                                {formatMinutes(recordingMinutes)}:{formatSeconds(recordingSeconds)}
                              </p>
                            </div>
                          }
                        </>
                    }
                    {/* Text below microphone */}
                    <div className="w-full mt-16 transition-all duration-500 z-[3]">
                      <div className="h-full w-full flex items-center justify-center lg:justify-start">
                        <h1 className="text-xl md:text-2xl text-center font-medium w-full lg:max-w-md whitespace-pre-line">
                          {
                            !micAvailable ?
                              <span className="text-red-500">
                                {trans("mic_not_detected")}
                              </span>
                              :
                              isRecording ?
                                <span>
                                  {trans("recording_started_1")}
                                  <i className="bi bi-mic px-2 text-primary"></i>
                                  {trans("recording_started_2")}
                                </span>
                                :
                                audio ?
                                  state === "PROCESSING_AUDIO" ?
                                    <span>
                                      {trans("audio_processing_1")}
                                      <br /><br />
                                      {trans("audio_processing_2")}
                                    </span>
                                    :
                                    <span>
                                      {trans("listen_again")}
                                    </span>
                                  :
                                  <span>
                                    {trans("start_recording_1")}
                                    <i className="bi bi-mic px-2 text-primary"></i>
                                    {trans("start_recording_2")}
                                  </span>

                          }
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  (apiResponse?.succeed && apiResponse?.data) &&
                  <div className="flex items-center justify-center max-w-screen-xl mx-auto pb-20">
                    {
                      apiResponse.data.transcription.trim().length > 0 ?
                        <p className="text-xl font-normal text-black text-center">
                          {apiResponse.data.transcription}
                        </p>
                        :
                        <p className="text-xl font-normal text-red-600 text-center whitespace-pre-line">
                          {trans("no_transcription")}
                        </p>
                    }
                  </div>
                }
              </div>
              {
                apiResponse && !apiResponse.succeed &&
                <div className="flex items-center justify-center mt-16 mb-4">
                  <p className="py-3 px-5 text-lg font-medium bg-red-100 text-red-700 rounded-md text-center whitespace-pre-line">
                    {trans("issue_processing_audio")}
                  </p>
                </div>
              }
              {
                <section className="flex w-full flex-col gap-10 lg:flex-row lg:gap-2 justify-between max-w-screen-xl mx-auto py-24 px-4 md:px-10">
                  {/* Markino Score  */}
                  <div className="text-center">
                    <h4 className="text-3xl font-semibold mb-4">
                      {trans("well_being_score")}
                    </h4>
                    <div className="flex items-center justify-center relative">
                      <svg className="transform -rotate-90 w-72 h-72">
                        <circle cx="145" cy="145" r="120" stroke="currentColor" strokeWidth="30" fill="transparent" className="text-secondary" />
                        <circle cx="145" cy="145" r="120" stroke="currentColor" strokeWidth="30" fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference - ((apiResponse?.data?.markino ?? 0) / 100 * circumference)}
                          className="text-primary " />
                      </svg>
                      <span className="absolute text-5xl left-1/2 -translate-x-1/2 ml-2"> {apiResponse?.data?.markino ?? 0}%</span>
                    </div>
                    {
                      apiResponse?.data?.keywords && apiResponse?.data?.keywords?.length <= 0 ?
                        <div className="mt-2">
                          <p className="text-lg text-red-600 font-normal">
                            {trans("no_keywords_found")}
                          </p>
                        </div>
                        :
                        <div className="mt-2">
                          {
                            apiResponse?.data?.keywords?.map((keyw) => (
                              <p key={keyw} className="text-lg text-gray-900 font-normal">{keyw}</p>
                            ))
                          }
                        </div>
                    }
                  </div>

                  <div className="flex items-center justify-center">
                    {
                      apiResponse?.data && apiResponse.succeed && apiResponse.data.zshot ?
                        <div className="w-full mt-10 flex items-end justify-center gap-5">
                          {
                            apiResponse.data.zshot.map((zitem) => {
                              return (
                                <div key={zitem.key} className="flex flex-col items-center w-20">
                                  <p className="text-sm">{zitem.value}%</p>
                                  <div className={"w-5 bg-secondary my-3 relative h-[200px]"}>
                                    <div className="w-full bg-primary z-[1] absolute bottom-0 " style={{ height: `${Math.max(1, (zitem.value))}%` }}></div>
                                  </div>
                                  <p className="text-xs capitalize">{zitem.key}</p>
                                </div>
                              )
                            })
                          }
                        </div>
                        :
                        <div className="flex items-center justify-center">
                          <p className="text-base text-center font-normal whitespace-pre-line">
                            {trans("nothing_to_show_here")}
                          </p>
                        </div>
                    }
                  </div>
                </section>
              }
            </>
        )
      }
    </Layout>
  )
}
