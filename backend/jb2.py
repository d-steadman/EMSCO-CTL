import requests

# URLs
JB2_API = "https://jb2.emsco-inc.com/jobboss2/api/v1/";
JB2_REGISTER = JB2_API + "register";
JB2_LOGIN = JB2_API + "login";

# API credentials
API_KEY = "E67E4E46-16B8-4C32-8B4D-2294C1EA6640";
USERNAME = "API";
PASSWORD = "EMSCO123";

def get_auth_token(session):
    """
    Gets auth token from JB2's register & login procedure.
    First, register client and obtain password hash, then
    login using the password hash, which returns an auth token.
    """

    def post_request(endpoint, password):
        """Handles both register & login post requests."""

        res = session.post(f"{endpoint}?apiKey={API_KEY}&username={USERNAME}&password={password}")
        res.raise_for_status()

        json = res.json()
        return json.get("result")

    password_hash = post_request(JB2_REGISTER, PASSWORD)
    return post_request(JB2_LOGIN, password_hash)


def paginator(session, url):
    """
    Encapsulate fetching all pages from an endpoint.
    Use the same session to reuse auth tokens.
    """

    def fetch_page(url, skip):
        """Individual page fetcher."""

        res = session.get(url + f"&skip={skip}")
        res.raise_for_status()

        json = res.json()
        return json.get("Data")

    skip = 0
    all_pages = []

    # Get pages while fetch_page returns records
    while (page := fetch_page(url, skip)):
        all_pages += page
        skip += 200

    return all_pages

if __name__ == "__main__":
    session = requests.Session()

    auth_token = get_auth_token(session)
    session.headers.update({"Authorization": f"Bearer {auth_token}"})

    releases = paginator(session, JB2_API + "releases?jobNumber[ne]=&deliveryTicketNumber=")
    jobs = [release.get("jobNumber") for release in releases]

    print(jobs, len(jobs))
