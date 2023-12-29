namespace SignalRExamples.Common;

public static class SD
{
    public const string Wand = "wand";
    public const string Sword = "sword";
    public const string Stone = "stone";
    public const string Cloak = "cloak";

    public static Dictionary<string, int> DeathlyHallowRace;

    static SD()
    {
        DeathlyHallowRace = new Dictionary<string, int>
        {
            { Wand, 0 },
            { Sword, 0 },
            { Stone, 0 },
            { Cloak, 0 }
        };
    }
}