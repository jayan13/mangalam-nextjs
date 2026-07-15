"use client";

import { DiscussionEmbed } from "disqus-react";

export default function DisqusComments({ id, title, url }) {
  const disqusConfig = {
    url,
    identifier: String(id),
    title,
  };

  return (
    <div className="news-comments mt-5 no-printme">
      <h3>Comments</h3>

      <DiscussionEmbed
        shortname={process.env.NEXT_PUBLIC_DISQUS_SHORTNAME}
        config={disqusConfig}
      />
    </div>
  );
}