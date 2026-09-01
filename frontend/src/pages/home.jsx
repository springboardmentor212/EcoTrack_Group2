import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Home() {
    const [pageKey, setPageKey] = useState(0)

    const handleLogoClick = () => {
        setPageKey((previousKey) => previousKey + 1)
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    useEffect(() => {
  window.scrollTo(0, 0)
}, [])

  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-[slideUp_0.8s_ease-out]')
          entry.target.classList.remove('opacity-0')
        }
      })
    },
    {
      threshold: 0.15,
    }
  )

  const elements = document.querySelectorAll('.scroll-reveal')

  elements.forEach((element) => observer.observe(element))

  return () => {
    elements.forEach((element) => observer.unobserve(element))
  }
}, [])


  const features = [
    {
      number: '01',
      title: 'Carbon Footprint Tracking',
      description:
        'Track transportation, electricity, fuel, food, waste, water usage, shopping, and travel activities while calculating your environmental impact.',
    },
    {
      number: '02',
      title: 'Sustainability Goals',
      description:
        'Create personal sustainability goals, monitor progress, and work toward reducing emissions, energy usage, water consumption, plastic waste, and more.',
    },
    {
      number: '03',
      title: 'AI Recommendations',
      description:
        'Receive personalized sustainability suggestions based on your activities, lifestyle habits, energy usage, transportation patterns, waste management, and goals.',
    },
    {
      number: '04',
      title: 'Community Challenges',
      description:
        'Participate in sustainability challenges, track your progress, compete through leaderboards, and work with others toward shared environmental goals.',
    },
    {
      number: '05',
      title: 'Analytics & Reports',
      description:
        'Understand your sustainability performance through dashboards, environmental metrics, progress analytics, and detailed sustainability reports.',
    },
    {
      number: '06',
      title: 'Rewards & Gamification',
      description:
        'Stay motivated with reward points, sustainability badges, achievement levels, eco scores, and community leaderboards.',
    },
  ]

  const journeySteps = [
    {
      number: '1',
      title: 'Track',
      description:
        'Record everyday activities that contribute to your environmental footprint.',
    },
    {
      number: '2',
      title: 'Analyze',
      description:
        'Understand your carbon footprint, sustainability score, and environmental patterns.',
    },
    {
      number: '3',
      title: 'Improve',
      description:
        'Follow personalized recommendations and work toward sustainability goals.',
    },
    {
      number: '4',
      title: 'Achieve',
      description:
        'Complete challenges, earn rewards, and measure your long-term sustainability progress.',
    },
  ]

  const platformItems = [
    {
      number: '01',
      title: 'Personalized Profiles',
      description: 'Preferences, interests, lifestyle and goals.',
    },
    {
      number: '02',
      title: 'Smart Recommendations',
      description: 'AI-driven sustainability improvement suggestions.',
    },
    {
      number: '03',
      title: 'Community Engagement',
      description: 'Challenges, leaderboards and shared progress.',
    },
    {
      number: '04',
      title: 'Actionable Insights',
      description: 'Analytics, notifications and environmental reports.',
    },
  ]

  return (
  <div
    key={pageKey}
    className="min-h-screen overflow-x-hidden bg-[#f7fbf8] font-[Arial] text-[#173f2a]">

      <header className="flex min-h-[76px] items-center justify-between border-b border-[#e5eee8] bg-white px-[7%]">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center no-underline"
          aria-label="EcoTrack Home"
        >
          <img
            src="/assets/Ecotrack1.png"
            alt="EcoTrack"
            className="block w-[145px]"
          />
        </Link>

        <div className="flex items-center gap-[18px]">
          <Link
            to="/login"
            className="text-[15px] font-semibold text-[#365443] no-underline transition duration-200 hover:text-[#27834d]"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-lg bg-[#27834d] px-[22px] py-[11px] text-sm font-semibold text-white no-underline transition duration-200 hover:-translate-y-[2px] hover:bg-[#1e6e40]"
          >
            Register
          </Link>
        </div>
      </header>

      <main>

        <section className="flex min-h-[570px] items-center justify-between gap-[70px] bg-[radial-gradient(circle_at_top_right,_#e3eee6,_#f7fbf8_58%)] px-[7%] py-[75px] max-[950px]:flex-col max-[950px]:px-[6%] max-[950px]:py-[70px] max-[950px]:text-center">

         <div className="max-w-[620px] animate-[slideRight_0.8s_ease-out]">
            <p className="mb-[15px] text-[13px] font-bold tracking-[1.5px] text-[#27834d]">
              BUILD A GREENER FUTURE
            </p>

            <h1 className="mb-6 text-[54px] font-bold leading-[1.08] text-[#173f2a] max-[600px]:text-[38px]">
              Track Your Carbon.
              <br />
              <span className="text-[#27834d]">
                Reduce Your Impact.
              </span>
            </h1>

            <p className="max-w-[560px] text-[17px] leading-[1.8] text-[#5f7267] max-[950px]:mx-auto">
              Understand your environmental impact, discover sustainable choices,
              and take meaningful steps toward a greener future.
            </p>
          </div>

         <div className="relative h-[390px] w-[440px] shrink-0 animate-[slideLeft_0.8s_ease-out] max-[600px]:h-[340px] max-[600px]:w-full">

            <div className="mx-auto mt-[35px] h-[310px] w-[310px] overflow-hidden rounded-full shadow-[0_20px_45px_rgba(23,63,42,0.15)] max-[600px]:h-[250px] max-[600px]:w-[250px]">
              <img
                src="/assets/earth.jpg"
                alt="Earth"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute right-0 top-[35px] flex items-center gap-3 rounded-xl border border-[#e1ebe4] bg-white px-4 py-[13px] shadow-[0_12px_30px_rgba(23,63,42,0.1)]">
              <img
                src="/assets/carbon.jpg"
                alt="Carbon"
                className="h-10 w-10 rounded-[9px] object-cover"
              />

              <div>
                <strong className="mb-1 block text-[13px] text-[#294a36]">
                  Carbon Saved
                </strong>

                <span className="text-xs text-[#718277]">
                  12.4 kg CO₂
                </span>
              </div>
            </div>

            <div className="absolute bottom-[25px] left-0 flex items-center gap-3 rounded-xl border border-[#e1ebe4] bg-white px-4 py-[13px] shadow-[0_12px_30px_rgba(23,63,42,0.1)]">
              <img
                src="/assets/graph.jpg"
                alt="Eco Score"
                className="h-10 w-10 rounded-[9px] object-cover"
              />

              <div>
                <strong className="mb-1 block text-[13px] text-[#294a36]">
                  Eco Score
                </strong>

                <span className="text-xs text-[#718277]">
                  82 / 100
                </span>
              </div>
            </div>

          </div>

        </section>

        <section className="bg-white px-[7%] pb-[75px] pt-[95px]">

          <div className="scroll-reveal opacity-0 mx-auto max-w-[850px] text-center">
            <p className="mb-[15px] text-[13px] font-bold tracking-[1.5px] text-[#27834d]">
              ABOUT ECOTRACK
            </p>

            <h2 className="mb-[22px] text-[46px] font-bold leading-[1.15] text-[#173f2a] max-[600px]:text-[34px]">
              Understand Your Impact.
              <br />
              <span className="text-[#27834d]">
                Change Your Future.
              </span>
            </h2>

            <p className="mx-auto max-w-[760px] text-[17px] leading-[1.8] text-[#65766c]">
              EcoTrack is an AI-powered carbon footprint and sustainability
              management platform designed to help individuals and organizations
              understand, manage, and reduce their environmental impact.
            </p>
          </div>

        </section>

        <section className="bg-[#f7fbf8] px-[7%] py-[95px]">

        <div className="scroll-reveal opacity-0 mx-auto mb-[55px] max-w-[750px] text-center">
            <p className="mb-[15px] text-[13px] font-bold tracking-[1.5px] text-[#27834d]">
              WHAT IS ECOTRACK?
            </p>

            <h2 className="mb-[15px] text-[40px] font-bold leading-[1.2] text-[#173f2a] max-[600px]:text-[32px]">
              One Platform for Your Sustainability Journey
            </h2>

            <p className="text-[16px] leading-[1.8] text-[#65766c]">
              EcoTrack brings environmental tracking, personalized recommendations,
              sustainability goals, community challenges, analytics, reports,
              and rewards together in one platform.
            </p>
          </div>

          <div className="mx-auto grid max-w-[1100px] grid-cols-[1.2fr_0.8fr] items-center gap-[60px] max-[950px]:grid-cols-1 max-[950px]:gap-[45px]">

            <div>
              <h3 className="mb-5 text-[28px] font-bold text-[#173f2a]">
                From Awareness to Action
              </h3>

              <p className="mb-[17px] text-[15px] leading-[1.8] text-[#65766c]">
                Understanding environmental impact is the first step toward making
                meaningful change. EcoTrack helps users turn that understanding
                into consistent action by providing clear insights into their
                daily activities.
              </p>

              <p className="mb-[17px] text-[15px] leading-[1.8] text-[#65766c]">
                From transportation and energy consumption to food, waste, water
                usage, shopping, and travel, EcoTrack provides a structured way
                to track activities and understand their environmental impact.
              </p>

              <p className="text-[15px] leading-[1.8] text-[#65766c]">
                Users can then set sustainability goals, receive personalized
                AI-powered recommendations, participate in community challenges,
                monitor progress, and generate environmental reports.
              </p>
            </div>

            <div className="grid gap-[15px]">

              {[
                ['Track', 'Understand your environmental activities.'],
                ['Analyze', 'Discover patterns and environmental impact.'],
                ['Improve', 'Follow recommendations and sustainability goals.'],
                ['Achieve', 'Build progress through challenges and rewards.'],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-xl border border-[#e2ece5] bg-white px-[22px] py-5 shadow-[0_10px_25px_rgba(23,63,42,0.05)]"
                >
                  <strong className="mb-[7px] block text-[17px] text-[#27834d]">
                    {title}
                  </strong>

                  <span className="text-[13px] leading-[1.6] text-[#65766c]">
                    {description}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </section>

        <section className="bg-white px-[7%] py-[95px]">

         <div className="scroll-reveal opacity-0 mx-auto mb-[55px] max-w-[750px] text-center">
            <p className="mb-[15px] text-[13px] font-bold tracking-[1.5px] text-[#27834d]">
              WHAT ECOTRACK OFFERS
            </p>

            <h2 className="mb-[15px] text-[40px] font-bold leading-[1.2] text-[#173f2a] max-[600px]:text-[32px]">
              Everything You Need to Live More Sustainably
            </h2>

            <p className="text-[16px] leading-[1.8] text-[#65766c]">
              EcoTrack connects multiple sustainability tools into one
              integrated experience.
            </p>
          </div>

          <div className="mx-auto grid max-w-[1100px] grid-cols-3 gap-[25px] max-[950px]:grid-cols-2 max-[600px]:grid-cols-1">

            {features.map((feature) => (
              <article
                key={feature.number}
                className="rounded-2xl border border-[#e2ece5] bg-[#f7fbf8] p-[30px] transition duration-300 hover:-translate-y-[7px] hover:bg-white hover:shadow-[0_18px_38px_rgba(23,63,42,0.09)]"
              >
                <div className="mb-[22px] text-[13px] font-bold tracking-[1px] text-[#27834d]">
                  {feature.number}
                </div>

                <h3 className="mb-3 text-[19px] font-bold leading-[1.35] text-[#173f2a]">
                  {feature.title}
                </h3>

                <p className="text-[14px] leading-[1.7] text-[#65766c]">
                  {feature.description}
                </p>
              </article>
            ))}

          </div>

        </section>

        <section className="bg-[#f7fbf8] px-[7%] py-[95px]">

         <div className="scroll-reveal opacity-0 mx-auto mb-[55px] max-w-[750px] text-center">
            <p className="mb-[15px] text-[13px] font-bold tracking-[1.5px] text-[#27834d]">
              HOW ECOTRACK WORKS
            </p>

            <h2 className="mb-[15px] text-[40px] font-bold leading-[1.2] text-[#173f2a] max-[600px]:text-[32px]">
              Your Sustainability Journey
            </h2>

            <p className="text-[16px] leading-[1.8] text-[#65766c]">
              EcoTrack turns everyday environmental data into meaningful actions
              and measurable progress.
            </p>
          </div>

          <div className="mx-auto flex max-w-[1100px] items-start justify-center max-[950px]:flex-wrap max-[950px]:gap-[35px]">

            {journeySteps.map((step, index) => (
              <div
                key={step.number}
                className="contents"
              >
                <div className="flex-1 text-center max-[950px]:basis-[calc(50%-18px)] max-[600px]:basis-full">
                  <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#27834d] text-[17px] font-bold text-white">
                    {step.number}
                  </div>

                  <h3 className="mb-[10px] text-[20px] font-bold text-[#173f2a]">
                    {step.title}
                  </h3>

                  <p className="mx-auto max-w-[190px] text-[13px] leading-[1.7] text-[#65766c]">
                    {step.description}
                  </p>
                </div>

                {index < journeySteps.length - 1 && (
                  <div className="mt-[26px] h-px w-[70px] shrink-0 bg-[#cfe0d4] max-[950px]:hidden" />
                )}
              </div>
            ))}

          </div>

        </section>

        <section className="bg-white px-[7%] py-[95px]">

          <div className="scroll-reveal opacity-0 mx-auto grid max-w-[1100px] grid-cols-2 items-center gap-[70px] max-[950px]:grid-cols-1 max-[950px]:gap-[45px]">
            <div>
              <p className="mb-[15px] text-[13px] font-bold tracking-[1.5px] text-[#27834d]">
                A CONNECTED PLATFORM
              </p>

              <h2 className="mb-5 text-[38px] font-bold leading-[1.2] text-[#173f2a] max-[600px]:text-[32px]">
                Built Around the Complete Sustainability Experience
              </h2>

              <p className="mb-[17px] text-[15px] leading-[1.8] text-[#65766c]">
                EcoTrack is designed as more than a carbon calculator. It
                connects tracking, goals, recommendations, community participation,
                analytics, notifications, reporting, and gamification into one
                sustainability ecosystem.
              </p>

              <p className="text-[15px] leading-[1.8] text-[#65766c]">
                The platform also supports separate user and administrator
                experiences, allowing sustainability activities and platform
                operations to be managed efficiently.
              </p>
            </div>

            <div className="grid gap-4">

              {platformItems.map((item) => (
                <div
                  key={item.number}
                  className="flex items-start gap-[18px] rounded-xl border border-[#e2ece5] bg-[#f7fbf8] p-5"
                >
                  <span className="text-[13px] font-bold text-[#27834d]">
                    {item.number}
                  </span>

                  <div>
                    <strong className="mb-[5px] block text-[15px] text-[#294a36]">
                      {item.title}
                    </strong>

                    <p className="text-[13px] leading-[1.6] text-[#718277]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}

            </div>

          </div>

        </section>

        <section className="bg-[radial-gradient(circle_at_center,_#e3eee6,_#f7fbf8_65%)] px-[7%] py-[100px]">

        <div className="scroll-reveal opacity-0 mx-auto max-w-[800px] text-center">
            <p className="mb-[15px] text-[13px] font-bold tracking-[1.5px] text-[#27834d]">
              OUR VISION
            </p>

            <h2 className="mb-5 text-[40px] font-bold leading-[1.2] text-[#173f2a] max-[600px]:text-[32px]">
              Make Sustainability a Part of Everyday Life
            </h2>

            <p className="text-[16px] leading-[1.8] text-[#65766c]">
              EcoTrack aims to make sustainability easier to understand, easier
              to track, and easier to act on. By combining environmental data
              with personalized guidance and meaningful engagement, the platform
              helps users move from simply knowing about their impact to actively
              reducing it.
            </p>
          </div>

        </section>

      </main>
    </div>
  )
}

export default Home