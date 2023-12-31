namespace SignalR.Hubs.Common;

public static class SD
{
    public const string Apollo = "apollo";
    public const string Voyager = "voyager";
    public const string Hubble = "hubble";
    public const string Mars = "mars";

    public static Dictionary<string, int> SpaceMissionVoting;

    static SD()
    {
        SpaceMissionVoting = new Dictionary<string, int>
        {
            { Apollo, 0 },
            { Voyager, 0 },
            { Hubble, 0 },
            { Mars, 0 }
        };
    }
}