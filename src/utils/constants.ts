export const QUERY_ID = "q88fRuxEq8t_M95MIQ53vw";
export const FEATURES = {
  "tweetypie_unmention_optimization_enabled": true,
  "responsive_web_edit_tweet_api_enabled": true,
  "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
  "view_counts_everywhere_api_enabled": true,
  "longform_notetweets_consumption_enabled": true,
  "responsive_web_twitter_article_tweet_consumption_enabled": false,
  "tweet_awards_web_tipping_enabled": false,
  "longform_notetweets_rich_text_read_enabled": true,
  "longform_notetweets_inline_media_enabled": true,
  "responsive_web_graphql_exclude_directive_enabled": true,
  "verified_phone_label_enabled": false,
  "freedom_of_speech_not_reach_fetch_enabled": true,
  "standardized_nudges_misinfo": true,
  "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
  "responsive_web_media_download_video_enabled": false,
  "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
  "responsive_web_graphql_timeline_navigation_enabled": true,
  "responsive_web_enhance_cards_enabled": false
};

export const payload = (id: number): object => {
  return {
    "variables": {
      "tweet_text": "",
      "media": {
        "media_entities": [{ "media_id": id }]
      },
    },
    "features": FEATURES
  };
}